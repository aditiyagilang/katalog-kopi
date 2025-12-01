<script>
  // Array untuk menyimpan semua ulasan di browser
  var reviewData = [];

  // Helper: format tanggal ke string
  function formatDateTime(date) {
    return date.toLocaleString("id-ID");
  }

  // Helper: tambah baris ke tabel di halaman
  function appendReviewRow(review) {
    var tbody = document.querySelector("#reviewTable tbody");
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td>" + review.datetime + "</td>" +
      "<td>" + (review.name || "Anonim") + "</td>" +
      "<td>" + review.drink + "</td>" +
      "<td>" + review.rating + "</td>" +
      "<td>" + (review.category || "-") + "</td>";
    tbody.prepend(tr); // ulasan terbaru di paling atas
  }

  // Helper: buat file CSV dari array reviewData
  function downloadCSV() {
    if (!reviewData.length) {
      alert("Belum ada ulasan yang tersimpan.");
      return;
    }

    // Header kolom CSV
    var header = [
      "datetime",
      "name",
      "contact",
      "drink",
      "rating",
      "category",
      "message"
    ];

    var rows = [header.join(",")];

    reviewData.forEach(function(r) {
      // Hindari koma berantakan di CSV, ganti koma dengan titik koma
      function safe(v) {
        if (v == null) return "";
        return String(v).replace(/,/g, ";").replace(/\r?\n/g, " ");
      }
      var line = [
        safe(r.datetime),
        safe(r.name),
        safe(r.contact),
        safe(r.drink),
        safe(r.rating),
        safe(r.category),
        safe(r.message)
      ].join(",");
      rows.push(line);
    });

    var csvContent = rows.join("\r\n");
    var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ulasan_kopi.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Event: submit form ulasan (id="contact")
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("contact");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // cegah reload halaman

      var name     = document.getElementById("reviewName").value.trim();
      var contact  = document.getElementById("reviewContact").value.trim();
      var drink    = document.getElementById("reviewDrink").value.trim();
      var rating   = document.getElementById("reviewRating").value;
      var category = document.getElementById("reviewCategory").value;
      var message  = document.getElementById("reviewText").value.trim();

      if (!drink || !rating || !message) {
        alert("Menu, rating, dan pesan ulasan wajib diisi.");
        return;
      }

      var now = new Date();
      var review = {
        datetime: formatDateTime(now),
        name: name,
        contact: contact,
        drink: drink,
        rating: rating,
        category: category,
        message: message
      };

      // Simpan ke array
      reviewData.push(review);
      // Tampilkan di tabel
      appendReviewRow(review);

      // Reset form
      form.reset();
      alert("Terima kasih, ulasanmu sudah tersimpan!");
    });

    var downloadBtn = document.getElementById("downloadExcelBtn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", downloadCSV);
    }
  });
</script>
