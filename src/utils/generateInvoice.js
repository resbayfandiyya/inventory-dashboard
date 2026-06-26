import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateInvoice(sale) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 14, 20);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  doc.text(`Invoice : ${sale.invoice_number}`, 14, 35);
  doc.text(`Customer : ${sale.customer_name}`, 14, 42);
  doc.text(`Payment : ${sale.payment_method}`, 14, 49);

  doc.text(
    `Date : ${new Date(sale.created_at).toLocaleDateString(
      "id-ID"
    )}`,
    14,
    56
  );

  // Table
  autoTable(doc, {
    startY: 65,
    head: [["No", "Product", "Category", "Qty", "Price", "Subtotal"]],
    body: sale.items.map((item, index) => [
      index + 1,
      item.product_name,
      item.category,
      item.quantity,
      `Rp ${Number(item.price).toLocaleString("id-ID")}`,
      `Rp ${Number(item.subtotal).toLocaleString("id-ID")}`,
    ]),
    theme: "striped",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);

  doc.text(
    `Total : Rp ${Number(sale.total_amount).toLocaleString(
      "id-ID"
    )}`,
    14,
    finalY
  );

  doc.save(`${sale.invoice_number}.pdf`);
}