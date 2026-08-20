import { describe, it, expect } from "vitest";
import { normalizeInvoiceFromApi } from "./formatInvoiceData.js";

describe("normalizeInvoiceFromApi", () => {
  it("maps flat api fields to the nested frontend shape", () => {
    const result = normalizeInvoiceFromApi({
      id: "abc-123",
      title: "Invoice Title",
      number: "INV-42",
      date: "2026-08-20",
      due_date: "2026-09-20",
      tax: "10.00",
      notes: "Some notes",
      logo: "data:image/png;base64,xxx",
      template: "template2",
      account_name: "Acme Corp",
      account_number: "1234567890",
      account_ifsc: "IFSC0001",
      company: { name: "Acme", phone: "1", address: "Addr" },
      billing: { name: "Bill", phone: "2", address: "BAddr" },
      shipping: { name: "Ship", phone: "3", address: "SAddr" },
      items: [{ name: "Widget", qty: 2, amount: "100.00" }],
    });

    expect(result.id).toBe("abc-123");
    expect(result.title).toBe("Invoice Title");
    expect(result.invoice).toEqual({
      number: "INV-42",
      date: "2026-08-20",
      dueDate: "2026-09-20",
    });
    expect(result.account).toEqual({
      name: "Acme Corp",
      number: "1234567890",
      ifsccode: "IFSC0001",
    });
    expect(result.company.name).toBe("Acme");
    expect(result.billing.name).toBe("Bill");
    expect(result.shipping.name).toBe("Ship");
    expect(result.items).toHaveLength(1);
    expect(result.logo).toBe("data:image/png;base64,xxx");
    expect(result.template).toBe("template2");
  });

  it("provides safe defaults when fields are missing", () => {
    const result = normalizeInvoiceFromApi(null);
    expect(result.items).toEqual([]);
    expect(result.company).toEqual({});
    expect(result.billing).toEqual({});
    expect(result.shipping).toEqual({});
    expect(result.invoice).toEqual({ number: "", date: "", dueDate: "" });
    expect(result.account).toEqual({ name: "", number: "", ifsccode: "" });
    expect(result.logo).toBe("");
    expect(result.template).toBe("");
    expect(result.tax).toBe(0);
  });

  it("defaults items to an empty array (regression guard for empty-invoice bug)", () => {
    const result = normalizeInvoiceFromApi({
      id: "1",
      number: "INV-1",
      items: undefined,
    });
    expect(result.items).toEqual([]);
  });
});