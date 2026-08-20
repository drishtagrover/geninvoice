import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PreviewPage from "./PreviewPage.jsx";
import { renderWithProviders } from "../test/renderWithProviders.jsx";
import { saveInvoice, updateInvoice } from "../service/invoiceService.js";

vi.mock("html2canvas", () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => "data:image/png;base64,AAAA",
  }),
}));

vi.mock("../service/cloudinaryService.js", () => ({
  uploadInvoiceThumbnail: vi.fn().mockResolvedValue("https://thumb.example/x.png"),
}));

vi.mock("../service/invoiceService.js", () => ({
  saveInvoice: vi.fn(),
  updateInvoice: vi.fn(),
  deleteInvoice: vi.fn(),
  sendInvoice: vi.fn(),
}));

const baseInvoiceData = {
  title: "Test Invoice",
  company: { name: "Acme", phone: "1", address: "Addr" },
  billing: { name: "Bill", phone: "2", address: "BAddr" },
  shipping: { name: "Ship", phone: "3", address: "SAddr" },
  invoice: { number: "INV-1", date: "2026-08-20", dueDate: "2026-09-20" },
  account: { name: "Acme", number: "123", ifsccode: "IFSC1" },
  tax: 10,
  notes: "",
  items: [{ name: "Widget", qty: 2, amount: "100.00" }],
  logo: "",
};

const renderPreview = (invoiceData, appContext = {}) =>
  renderWithProviders(
    <MemoryRouter>
      <PreviewPage />
    </MemoryRouter>,
    {
      appContext: {
        invoiceData,
        selectedTemplate: "template1",
        baseURL: "http://localhost:8000/api",
        ...appContext,
      },
    }
  );

describe("PreviewPage save behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    saveInvoice.mockResolvedValue({ status: 201 });
    updateInvoice.mockResolvedValue({ status: 200 });
  });

  it("updates (PATCH) an existing invoice instead of creating a new one", async () => {
    const existing = { ...baseInvoiceData, id: "abc-123" };
    renderPreview(existing);

    await userEvent.click(screen.getByRole("button", { name: "Save and exit" }));

    await waitFor(() => {
      expect(updateInvoice).toHaveBeenCalledWith(
        "http://localhost:8000/api",
        "abc-123",
        expect.objectContaining({
          number: "INV-1",
          account_name: "Acme",
          thumbnail_url: "https://thumb.example/x.png",
        }),
        "test-token"
      );
    });
    expect(saveInvoice).not.toHaveBeenCalled();
  });

  it("creates (POST) a new invoice when there is no id", async () => {
    renderPreview({ ...baseInvoiceData });

    await userEvent.click(screen.getByRole("button", { name: "Save and exit" }));

    await waitFor(() => {
      expect(saveInvoice).toHaveBeenCalledWith(
        "http://localhost:8000/api",
        expect.objectContaining({ number: "INV-1" }),
        "test-token"
      );
    });
    expect(updateInvoice).not.toHaveBeenCalled();
  });
});