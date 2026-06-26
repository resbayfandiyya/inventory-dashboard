import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function exportSalesExcel(sales) {
  const data = sales.map((sale, index) => ({
    No: index + 1,
    Invoice: sale.invoice_number,
    Produk: sale.products,
    Customer: sale.customer_name,
    Payment: sale.payment_method,
    Total: Number(sale.total_amount),
    Tanggal: new Date(
      sale.created_at
    ).toLocaleDateString("id-ID"),
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Sales"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const file = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    file,
    `sales-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`
  );
}