export const buildInvoicePayload = (invoiceData, template, thumbnailUrl) => {
    const payload = {
        ...invoiceData,
        number: invoiceData.invoice?.number,
        date: invoiceData.invoice?.date,
        due_date: invoiceData.invoice?.dueDate,
        account_name: invoiceData.account?.name,
        account_number: invoiceData.account?.number,
        account_ifsc: invoiceData.account?.ifsccode,
        thumbnail_url: thumbnailUrl,
        template,
    };
    delete payload.invoice;
    delete payload.account;
    return payload;
};