import React, { forwardRef } from 'react'
import { formatInvoiceData } from "../util/formatInvoiceData.js";
import Template1 from '../templates/Template1/Template1.jsx';
import { templateComponents } from '../util/InvoiceTemplates.js';

const InvoicePreview = forwardRef(({invoiceData,template},ref) => {
    const formattedData = formatInvoiceData(invoiceData);

    const SelectedTemplate= templateComponents[template] || templateComponents["template1"]

  return (
    <div ref={ref} className='invoice-preview container px-2 py-2 overflow-auto'>
        <SelectedTemplate data={formattedData} />
    </div>
  )
})

export default InvoicePreview