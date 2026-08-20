import React, { useContext, useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext, initialInvoiceData } from "../context/AppContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { getAllInvoices, getInvoice, deleteInvoice } from '../service/invoiceService';
import { formatDate, normalizeInvoiceFromApi } from "../util/formatInvoiceData.js";
import ConfirmModal from '../components/ConfirmModal';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { baseURL, setInvoiceData, setSelectedTemplate, setInvoiceTitle } = useContext(AppContext);
  const { getToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = await getToken();
        const response = await getAllInvoices(baseURL, token);
        setInvoices(response.data);
      } catch (error) {
        console.error("Failed to load invoices", error);
        toast.error("Something went wrong. Unable to load invoices");
      }
    };
    fetchInvoices();
  }, [baseURL]);

  const loadInvoice = async (invoice) => {
    const token = await getToken();
    const response = await getInvoice(baseURL, invoice.id, token);
    setInvoiceData(normalizeInvoiceFromApi(response.data));
    setSelectedTemplate(response.data.template || "template1");
    setInvoiceTitle(response.data.title || "View Invoice");
    return response.data;
  };

  const handleViewClick = async (invoice) => {
    try {
      await loadInvoice(invoice);
      navigate("/preview");
    } catch (error) {
      console.error("Failed to load invoice", error);
      toast.error("Failed to load invoice");
    }
  };

  const handleEditClick = async (e, invoice) => {
    e.stopPropagation();
    try {
      await loadInvoice(invoice);
      navigate("/generate");
    } catch (error) {
      console.error("Failed to load invoice", error);
      toast.error("Failed to load invoice");
    }
  };

  const handleDeleteClick = (e, invoice) => {
    e.stopPropagation();
    setDeleteTarget(invoice);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      const token = await getToken();
      const response = await deleteInvoice(baseURL, deleteTarget.id, token);
      if (response.status === 204) {
        toast.success("Invoice deleted successfully");
        setInvoices((prev) => prev.filter((inv) => inv.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error("Unable to delete invoice.");
      }
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateNew = () => {
    setInvoiceTitle("New Invoice");
    setSelectedTemplate("template1");
    setInvoiceData(initialInvoiceData);
    navigate("/generate");
  };

  return (
    <div className="container py-5">
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5 g-4">
        <div className="col">
          <div onClick={handleCreateNew}
            className="card h-100 d-flex justify-content-center align-items-center border border-2 border-light shadow-sm"
            style={{ cursor: "pointer", minHeight: "270px" }}
          >
            <Plus size={48} />
            <p className="mt-3 fw-medium">Create New Invoice</p>
          </div>
        </div>
        {invoices.map((invoice, idx) => (
          <div className='col' key={idx}>
            <div className='card h-100 shadow-sm cursor-pointer' style={{ minHeight: '270px' }} onClick={() => handleViewClick(invoice)}>
              {invoice.thumbnail_url && (
                <img src={invoice.thumbnail_url} alt='Invoice Thumbnail' className='card-img-top' style={{ height: "200px", objectFit: "cover" }} />
              )}
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="card-title mb-1">{invoice.title}</h6>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary p-1 d-inline-flex align-items-center"
                      onClick={(e) => handleEditClick(e, invoice)}
                      aria-label={`Edit ${invoice.title}`}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger p-1 d-inline-flex align-items-center"
                      onClick={(e) => handleDeleteClick(e, invoice)}
                      aria-label={`Delete ${invoice.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <small className="text-muted">
                  Last Updated: {formatDate(invoice.last_updated_at)}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        show={!!deleteTarget}
        title="Delete Invoice"
        message={`Are you sure you want to delete "${deleteTarget?.title || 'this invoice'}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

export default Dashboard
