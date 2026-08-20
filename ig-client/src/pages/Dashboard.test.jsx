import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { getAllInvoices, deleteInvoice } from "../service/invoiceService.js";

vi.mock("../service/invoiceService.js", () => ({
  getAllInvoices: vi.fn(),
  getInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
}));

const mockInvoices = [
  { id: "1", title: "Invoice One", last_updated_at: "2026-08-20", thumbnail_url: "" },
  { id: "2", title: "Invoice Two", last_updated_at: "2026-08-19", thumbnail_url: "" },
];

const renderDashboard = () =>
  renderWithProviders(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAllInvoices.mockResolvedValue({ data: mockInvoices });
  });

  it("renders invoice cards with edit and delete icons", async () => {
    renderDashboard();

    expect(await screen.findByText("Invoice One")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit Invoice One")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete Invoice One")).toBeInTheDocument();
    expect(screen.getByLabelText("Edit Invoice Two")).toBeInTheDocument();
    expect(screen.getByLabelText("Delete Invoice Two")).toBeInTheDocument();
  });

  it("shows confirmation modal and deletes invoice on confirm", async () => {
    deleteInvoice.mockResolvedValue({ status: 204 });
    renderDashboard();

    await userEvent.click(await screen.findByLabelText("Delete Invoice One"));

    expect(
      screen.getByText(/Are you sure you want to delete "Invoice One"/)
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(deleteInvoice).toHaveBeenCalledWith(
        "http://localhost:8000/api",
        "1",
        "test-token"
      );
    });
    await waitFor(() => {
      expect(screen.queryByText("Invoice One")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Invoice Two")).toBeInTheDocument();
  });

  it("does not delete when confirmation is cancelled", async () => {
    renderDashboard();

    await userEvent.click(await screen.findByLabelText("Delete Invoice One"));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(deleteInvoice).not.toHaveBeenCalled();
    expect(screen.getByText("Invoice One")).toBeInTheDocument();
    expect(
      screen.queryByText(/Are you sure you want to delete/)
    ).not.toBeInTheDocument();
  });
});