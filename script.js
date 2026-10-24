
const moodQuestions = [
  "Kurang tertarik atau kurang menikmati kegiatan sehari-hari.",
  "Merasa sedih, murung, atau kehilangan harapan.",
  "Mengalami kesulitan tidur atau tidur lebih banyak dari biasanya.",
  "Merasa lelah atau kurang bertenaga.",
  "Mengalami perubahan nafsu makan.",
  "Merasa buruk tentang diri sendiri atau merasa mengecewakan orang lain.",
  "Kesulitan berkonsentrasi, misalnya saat belajar atau membaca.",
  "Merasa lebih lambat dari biasanya atau justru lebih gelisah dari biasanya.",
  "Memiliki pikiran bahwa hidup tidak layak dijalani atau dorongan untuk menyakiti diri."
];

const lonelyQuestions = [
  "Saya merasa selaras dengan orang-orang di sekitar saya.",
  "Saya merasa kurang memiliki teman.",
  "Tidak ada orang yang benar-benar bisa saya ajak bicara.",
  "Saya merasa sendirian.",
  "Saya merasa menjadi bagian dari kelompok pertemanan.",
  "Saya memiliki banyak kesamaan dengan orang-orang di sekitar saya.",
  "Saya tidak merasa dekat dengan siapa pun.",
  "Minat dan gagasan saya terasa tidak dimengerti oleh orang lain.",
  "Saya adalah orang yang mudah bergaul.",
  "Ada orang-orang yang dekat dengan saya.",
  "Saya merasa ditinggalkan.",
  "Hubungan sosial saya terasa kurang bermakna.",
  "Tidak ada orang yang benar-benar mengenal saya dengan baik.",
  "Saya merasa terasing dari orang lain.",
  "Saya dapat menemukan teman ketika membutuhkannya.",
  "Ada orang yang benar-benar memahami saya.",
  "Saya merasa malu atau menarik diri dalam hubungan sosial.",
  "Orang-orang berada di sekitar saya, tetapi tidak terasa dekat.",
  "Ada orang yang bisa saya andalkan.",
  "Ada orang yang bisa saya ajak bicara ketika membutuhkan dukungan."
];

const moodOptions = [
  "Tidak pernah",
  "Beberapa hari",
  "Lebih dari separuh hari",
  "Hampir setiap hari"
];

const lonelyOptions = [
  "Tidak pernah",
  "Jarang",
  "Kadang-kadang",
  "Selalu"
];

// Indeks dimulai dari 0.
// Item positif dibalik agar skor yang lebih tinggi
// tetap menunjukkan perasaan kesepian yang lebih sering.
const positiveLonelyItems = new Set([
  0, 4, 5, 8, 9, 14, 15, 18, 19
]);

const dashboard = document.getElementById("dashboard");
const testPage = document.getElementById("testPage");
const resultsPage = document.getElementById("results");
const form = document.getElementById("mentalForm");
const sections = [...document.querySelectorAll(".test-section")];

let currentSection = 0;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderQuestions(items, options, containerId, prefix) {
  const container = document.getElementById(containerId);

  container.innerHTML = items.map((question, index) => {
    const name = `${prefix}${index}`;

    const choices = options.map((option, value) => `
      <label class="choice">
        <input
          type="radio"
          name="${name}"
          value="${value}"
          required
        >
        <span>${escapeHTML(option)}</span>
      </label>
    `).join("");

    return `
      <article class="question-card">
        <p class="question-title">
          <span class="question-number">
            ${String(index + 1).padStart(2, "0")}.
          </span>
          ${escapeHTML(question)}
        </p>
        <div class="choice-list">${choices}</div>
      </article>
    `;
  }).join("");
}

renderQuestions(
  moodQuestions,
  moodOptions,
  "moodQuestions",
  "mood_"
);

renderQuestions(
  lonelyQuestions,
  lonelyOptions,
  "lonelyQuestions",
  "lonely_"
);

// ------------------------------
// NAVIGASI HALAMAN
// ------------------------------

function showDashboard() {
  dashboard.classList.remove("hidden");
  testPage.classList.add("hidden");
  resultsPage.classList.add("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showTest() {
  dashboard.classList.add("hidden");
  resultsPage.classList.add("hidden");
  testPage.classList.remove("hidden");

  showSection(0);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showResults() {
  dashboard.classList.add("hidden");
  testPage.classList.add("hidden");
  resultsPage.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("startTest").addEventListener(
  "click", showTest
);

document.getElementById("startTestBottom").addEventListener(
  "click", showTest
);

document.getElementById("backDashboard").addEventListener(
  "click", showDashboard
);

document.getElementById("backToDashboardFromResults").addEventListener(
  "click", showDashboard
);

document.getElementById("brandHome").addEventListener("click", event => {
  event.preventDefault();
  showDashboard();
});

// ------------------------------
// PROGRES DAN VALIDASI
// ------------------------------

function updateProgress() {
  const percent = Math.round(
    ((currentSection + 1) / sections.length) * 100
  );

  document.getElementById("progressLabel").textContent =
    `Bagian ${currentSection + 1} dari ${sections.length}`;

  document.getElementById("progressPercent").textContent =
    `${percent}%`;

  document.getElementById("progressBar").style.width =
    `${percent}%`;
}

function showSection(index) {
  currentSection = index;

  sections.forEach((section, sectionIndex) => {
    section.classList.toggle(
      "active",
      sectionIndex === index
    );
  });

  updateProgress();

  testPage.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function validateSection(index) {
  const section = sections[index];

  const requiredInputs = [
    ...section.querySelectorAll(
      'input[type="radio"][required]'
    )
  ];

  const groupNames = [
    ...new Set(requiredInputs.map(input => input.name))
  ];

  for (const name of groupNames) {
    const selected = section.querySelector(
      `input[name="${name}"]:checked`
    );

    if (!selected) {
      const firstInput = section.querySelector(
        `input[name="${name}"]`
      );

      const card = firstInput.closest(".question-card");

      card?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      firstInput.focus({ preventScroll: true });

      alert(
        "Silakan jawab semua pertanyaan wajib pada bagian ini."
      );

      return false;
    }
  }

  return true;
}

document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    if (!validateSection(currentSection)) return;

    if (currentSection < sections.length - 1) {
      showSection(currentSection + 1);
    }
  });
});

document.querySelectorAll("[data-prev]").forEach(button => {
  button.addEventListener("click", () => {
    if (currentSection > 0) {
      showSection(currentSection - 1);
    }
  });
});

// ------------------------------
// PERHITUNGAN SKOR
// ------------------------------

function readScores() {
  let moodScore = 0;
  let lonelyScore = 0;

  moodQuestions.forEach((question, index) => {
    const selected = form.querySelector(
      `input[name="mood_${index}"]:checked`
    );

    if (selected) {
      moodScore += Number(selected.value);
    }
  });

  lonelyQuestions.forEach((question, index) => {
    const selected = form.querySelector(
      `input[name="lonely_${index}"]:checked`
    );

    if (!selected) return;

    // Nilai asli 0–3 dikonversi menjadi 1–4.
    const value = Number(selected.value) + 1;

    // Item positif dibalik: 1 menjadi 4, 4 menjadi 1.
    lonelyScore += positiveLonelyItems.has(index)
      ? 5 - value
      : value;
  });

  function selectedValue(name) {
    return form.querySelector(
      `input[name="${name}"]:checked`
    )?.value ?? null;
  }

  return {
    moodScore,
    lonelyScore,
    impact: selectedValue("impact"),
    support: selectedValue("support"),
    pastRisk: selectedValue("pastRisk"),
    currentRisk: selectedValue("currentRisk")
  };
}

// ------------------------------
// KATEGORI SUASANA HATI
// ------------------------------

function getMoodCategory(score) {
  if (score <= 4) {
    return {
      level: "Minimal",
      description:
        "Jawaban berada pada rentang skor minimal. Tetap perhatikan perubahan perasaan, rutinitas, kualitas tidur, dan aktivitas yang membuatmu nyaman."
    };
  }

  if (score <= 9) {
    return {
      level: "Ringan",
      description:
        "Ada beberapa gejala yang layak diperhatikan. Amati kapan gejala muncul dan bicarakan dengan orang tepercaya jika mulai mengganggu kegiatan."
    };
  }

  if (score <= 14) {
    return {
      level: "Sedang",
      description:
        "Gejala yang dilaporkan perlu diperhatikan lebih lanjut. Pertimbangkan berbicara dengan guru BK, psikolog, dokter, atau tenaga kesehatan."
    };
  }

  if (score <= 19) {
    return {
      level: "Sedang–berat",
      description:
        "Gejala yang dilaporkan mungkin cukup mengganggu keseharian. Dianjurkan mencari dukungan profesional untuk penilaian yang lebih lengkap."
    };
  }

  return {
    level: "Berat",
    description:
      "Skor berada pada rentang tinggi dan perlu ditanggapi secara serius. Hubungi tenaga kesehatan untuk membicarakan keadaanmu dan pilihan dukungan."
  };
}

// ------------------------------
// KATEGORI HUBUNGAN SOSIAL
// ------------------------------

function getLonelyCategory(score) {
  // Pembagian deskriptif untuk prototipe, bukan batas klinis.
  if (score <= 35) {
    return {
      level: "Rentang lebih rendah",
      description:
        "Jawaban menunjukkan perasaan kesepian yang relatif lebih rendah menurut pembagian prototipe. Terus rawat hubungan yang sehat dan dukungan sosialmu."
    };
  }

  if (score <= 50) {
    return {
      level: "Rentang menengah",
      description:
        "Beberapa jawaban mungkin menunjukkan pengalaman kesepian. Perhatikan kebutuhan sosialmu dan cari kesempatan berinteraksi dalam lingkungan yang nyaman."
    };
  }

  if (score <= 65) {
    return {
      level: "Rentang lebih tinggi",
      description:
        "Jawaban menunjukkan perasaan kesepian yang lebih sering menurut pembagian prototipe. Berbicara dengan orang tepercaya dapat menjadi langkah awal."
    };
  }

  return {
    level: "Rentang sangat tinggi",
    description:
      "Jawaban menunjukkan perasaan kesepian yang sering menurut pembagian prototipe. Pertimbangkan mencari dukungan dari orang tepercaya atau konselor."
  };
}

// ------------------------------
// TAMPILKAN HASIL
// ------------------------------

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function setRange(id, score, min, max) {
  const percentage = ((score - min) / (max - min)) * 100;

  document.getElementById(id).style.width =
    `${Math.max(0, Math.min(100, percentage))}%`;
}

function getImpactDescription(value) {
  const descriptions = {
    "0": "Kamu melaporkan bahwa pengalaman tersebut tidak mengganggu kegiatan sehari-hari.",
    "1": "Kamu melaporkan sedikit gangguan dalam kegiatan sehari-hari. Tetap amati apakah keadaan berubah.",
    "2": "Kamu melaporkan gangguan yang cukup besar dalam kegiatan sehari-hari. Pertimbangkan mencari dukungan dari orang tepercaya atau tenaga profesional.",
    "3": "Kamu melaporkan kesulitan besar menjalani kegiatan sehari-hari. Akan baik jika kamu segera meminta dukungan orang tepercaya dan tenaga kesehatan."
  };

  return descriptions[value] || "Informasi dampak kegiatan belum tersedia.";
}

function getSupportDescription(value) {
  const descriptions = {
    yes: "Kamu menyatakan memiliki seseorang yang dapat diajak berbicara. Pertimbangkan menghubungi orang tersebut ketika membutuhkan dukungan.",
    sometimes: "Kamu menyatakan terkadang memiliki tempat bercerita. Kamu dapat memikirkan siapa orang yang aman dan dapat dihubungi ketika diperlukan.",
    no: "Kamu menyatakan belum memiliki seseorang untuk diajak berbicara. Guru BK, orang dewasa tepercaya, psikolog, atau tenaga kesehatan dapat menjadi titik awal untuk mencari dukungan."
  };

  return descriptions[value] || "";
}

function renderSafety(scores) {
  const box = document.getElementById("safetyResult");
  box.className = "safety-result";
  box.replaceChildren();

  const heading = document.createElement("h2");
  const paragraph = document.createElement("p");

  if (scores.currentRisk === "yes") {
    box.classList.add("urgent");
    heading.textContent = "Prioritaskan keselamatanmu sekarang";

    paragraph.textContent =
      "Terima kasih telah menjawab dengan jujur. Jangan menunggu skor atau rekomendasi lainnya. Segera beri tahu orang dewasa tepercaya, orang tua/wali, guru BK, atau tenaga kesehatan. Mintalah seseorang yang dapat dipercaya untuk menemanimu. Jika kamu merasa berada dalam bahaya langsung, hubungi layanan darurat setempat atau pergi ke IGD dengan bantuan orang dewasa.";

    box.append(heading, paragraph);
    return;
  }

  if (scores.pastRisk === "yes") {
    heading.textContent = "Kamu layak mendapatkan dukungan";

    paragraph.textContent =
      "Pengalaman yang membahayakan diri layak ditanggapi dengan serius tanpa menghakimi. Pertimbangkan berbicara dengan orang dewasa tepercaya atau tenaga kesehatan. Kamu tidak harus menceritakan detail yang belum siap kamu bagikan.";

    box.append(heading, paragraph);
    return;
  }

  if (
    scores.currentRisk === "prefer" ||
    scores.pastRisk === "prefer"
  ) {
    heading.textContent = "Dukungan tetap tersedia";

    paragraph.textContent =
      "Kamu tidak wajib membagikan sesuatu yang belum siap kamu ceritakan. Jika ada kekhawatiran tentang keselamatan diri, berbicaralah secara pribadi dengan orang dewasa tepercaya atau tenaga kesehatan.";

    box.append(heading, paragraph);
    return;
  }

  if (scores.moodScore >= 10) {
    heading.textContent = "Pertimbangkan dukungan lebih lanjut";

    paragraph.textContent =
      "Skor bukan diagnosis. Karena ada gejala yang perlu diperhatikan, pertimbangkan berbicara dengan orang tepercaya atau tenaga kesehatan untuk memahami kebutuhanmu.";

    box.append(heading, paragraph);
    return;
  }

  box.classList.add("hidden");
}

// ------------------------------
// REKOMENDASI TINDAKAN
// ------------------------------

function buildRecommendations(scores) {
  const recommendations = [];

  if (scores.moodScore <= 4) {
    recommendations.push(
      "Pertahankan rutinitas yang mendukung kesejahteraan, seperti tidur teratur, makan secara teratur, aktivitas yang kamu nikmati, dan hubungan sosial yang sehat."
    );
  } else {
    recommendations.push(
      "Amati perubahan suasana hati dan hal-hal yang memengaruhinya. Coba aktivitas sederhana yang terasa nyaman dan jangan memaksakan diri untuk menyelesaikan semuanya sekaligus."
    );
  }

  if (scores.moodScore >= 10) {
    recommendations.push(
      "Pertimbangkan konsultasi dengan psikolog, dokter, atau tenaga kesehatan untuk penilaian lebih lanjut, terutama jika gejala berlangsung atau mengganggu keseharian."
    );
  }

  if (Number(scores.impact) >= 2) {
    recommendations.push(
      "Karena kegiatan sehari-hari cukup terganggu, ceritakan situasimu kepada orang dewasa tepercaya atau guru BK dan mintalah bantuan untuk mendapatkan dukungan yang sesuai."
    );
  }

  if (scores.lonelyScore >= 36) {
    recommendations.push(
      "Cobalah menghubungi seseorang yang membuatmu merasa aman, bergabung dengan kegiatan yang kamu sukai, atau berbicara dengan guru BK jika merasa sulit membangun hubungan sosial."
    );
  } else {
    recommendations.push(
      "Terus jaga hubungan yang positif. Ingat bahwa meminta bantuan ketika dibutuhkan adalah hal yang wajar."
    );
  }

  if (scores.support === "no") {
    recommendations.push(
      "Jika belum memiliki tempat bercerita, kamu dapat memulai dengan guru BK, orang dewasa yang kamu percaya, psikolog, dokter, atau tenaga kesehatan."
    );
  }

  if (scores.pastRisk === "yes") {
    recommendations.push(
      "Pertimbangkan berbicara secara aman dengan orang dewasa tepercaya atau tenaga kesehatan tentang pengalaman yang membahayakan diri. Kamu tidak harus menjelaskan detail yang belum siap kamu ceritakan."
    );
  }

  if (scores.currentRisk === "yes") {
    recommendations.unshift(
      "Prioritas utama adalah keselamatanmu saat ini. Segera beri tahu orang dewasa tepercaya dan mintalah pendampingan langsung. Jangan menghadapi keadaan ini sendirian."
    );
  }

  if (
    scores.currentRisk === "prefer" ||
    scores.pastRisk === "prefer"
  ) {
    recommendations.push(
      "Jika kamu memiliki kekhawatiran tentang keselamatan diri, pertimbangkan berbicara secara pribadi dengan orang dewasa tepercaya atau tenaga kesehatan."
    );
  }

  recommendations.push(
    "Hasil tes ini bukan diagnosis. Jika gejala memburuk, berlangsung lama, atau membuat kegiatan sehari-hari semakin sulit, cari penilaian profesional."
  );

  return recommendations;
}

function renderRecommendations(items) {
  const list = document.getElementById("recommendations");
  list.replaceChildren();

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  if (!validateSection(currentSection)) return;

  const scores = readScores();
  const mood = getMoodCategory(scores.moodScore);
  const lonely = getLonelyCategory(scores.lonelyScore);

  setText("moodScore", `${scores.moodScore}/27`);
  setText("moodLevel", mood.level);
  setText("moodDescription", mood.description);

  setRange("moodRange", scores.moodScore, 0, 27);

  setText("lonelyScore", `${scores.lonelyScore}/80`);
  setText("lonelyLevel", lonely.level);
  setText("lonelyDescription", lonely.description);

  setRange("lonelyRange", scores.lonelyScore, 20, 80);

  setText(
    "impactDescription",
    getImpactDescription(scores.impact)
  );

  setText(
    "supportDescription",
    getSupportDescription(scores.support)
  );

  renderRecommendations(buildRecommendations(scores));
  renderSafety(scores);

  showResults();
});

// ------------------------------
// CETAK DAN ULANGI
// ------------------------------

document.getElementById("printBtn").addEventListener("click", () => {
  window.print();
});

document.getElementById("restartBtn").addEventListener("click", () => {
  form.reset();

  // Reset tampilan hasil agar hasil lama tidak terlihat.
  document.getElementById("safetyResult").className = "hidden";
  document.getElementById("safetyResult").replaceChildren();

  document.getElementById("moodRange").style.width = "0%";
  document.getElementById("lonelyRange").style.width = "0%";

  showDashboard();
});

updateProgress();
