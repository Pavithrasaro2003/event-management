const PDFDocument = require('pdfkit');
const stream = require('stream');

/**
 * Generate a PDF buffer containing a table of attendees for a given event.
 * @param {Object} event - Event object (title, date, location).
 * @param {Array} bookings - List of booking objects with user info.
 * @returns {Promise<Buffer>} Resolves to a PDF buffer.
 */
function generateAttendeesPdf(event, bookings) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Header
    doc.fontSize(20).text(`Attendees for ${event.title}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${event.date} | Location: ${event.location}`);
    doc.moveDown();

    // Table header
    const tableTop = doc.y;
    const colWidths = [50, 150, 180, 80, 80]; // ID, Name, Email, Tickets, Amount
    const headers = ['#', 'Name', 'Email', 'Tickets', 'Paid'];
    let x = doc.x;
    headers.forEach((h, i) => {
      doc.font('Helvetica-Bold').fontSize(10).text(h, x, tableTop, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    doc.moveDown();
    doc.moveTo(doc.x, doc.y).stroke();
    // Rows
    bookings.forEach((b, index) => {
      const rowY = doc.y + 5;
      x = doc.x;
      const row = [index + 1, b.User?.name || 'N/A', b.User?.email || 'N/A', b.ticketCount, `$${b.totalAmount.toFixed(2)}`];
      row.forEach((cell, i) => {
        doc.font('Helvetica').fontSize(10).text(cell.toString(), x, rowY, { width: colWidths[i], align: 'left' });
        x += colWidths[i];
      });
      doc.moveDown();
    });

    doc.end();
  });
}

module.exports = { generateAttendeesPdf };
