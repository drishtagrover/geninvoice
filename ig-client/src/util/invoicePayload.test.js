import { describe, it, expect } from "vitest";
import { buildInvoicePayload } from "./invoicePayload.js";

describe("buildInvoicePayload", () => {
  const invoiceData = {
    id: "abc-123",
    title: "My Invoice",
    invoice: { number: "INV-7", date: "2026-08-20", dueDate: "2026-09-20" },
    account: { name: "Acme", number: "987654", ifsccode: "IFSC0987" },
    company: { name: "Acme" },
    items: [{ name: "Widget", qty: 2, amount: "50.00" }],
  };

  it("flattens nested invoice/account into api fields", () => {
    const payload = buildInvoicePayload(invoiceData, "template1", "https://thumb/x.png");

    expect(payload.id).toBe("abc-123");
    expect(payload.title).toBe("My Invoice");
    expect(payload.number).toBe("INV-7");
    expect(payload.date).toBe("2026-08-20");
    expect(payload.due_date).toBe("2026-09-20");
    expect(payload.account_name).toBe("Acme");
    expect(payload.account_number).toBe("987654");
    expect(payload.account_ifsc).toBe("IFSC0987");
    expect(payload.template).toBe("template1");
    expect(payload.thumbnail_url).toBe("https://thumb/x.png");
    expect(payload.company).toEqual({ name: "Acme" });
    expect(payload.items).toHaveLength(1);
  });

  it("removes nested invoice/account objects from the payload", () => {
    const payload = buildInvoicePayload(invoiceData, "template1", "thumb");
    expect(payload.invoice).toBeUndefined();
    expect(payload.account).toBeUndefined();
  });

  it("handles missing invoice/account gracefully", () => {
    const payload = buildInvoicePayload(
      { items: [], title: "x" },
      "template1",
      "thumb"
    );
    expect(payload.number).toBeUndefined();
    expect(payload.account_name).toBeUndefined();
    expect(payload.items).toEqual([]);
  });
});