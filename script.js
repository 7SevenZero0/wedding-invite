// Плавный скролл по атрибуту data-scroll-to
document.querySelectorAll("[data-scroll-to]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const targetSelector = trigger.getAttribute("data-scroll-to");
    const target = targetSelector ? document.querySelector(targetSelector) : null;

    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// Плавное появление блоков при скролле
const revealElements = document.querySelectorAll(".js-reveal");
const timelineItems = document.querySelectorAll(".timeline-item");

if ("IntersectionObserver" in window && (revealElements.length > 0 || timelineItems.length > 0)) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("js-reveal--visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));

  if (timelineItems.length > 0) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const item = entry.target;
          if (!(item instanceof HTMLElement)) return;
          if (entry.isIntersecting) {
            item.classList.add("timeline-item--active");
          } else {
            item.classList.remove("timeline-item--active");
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-40px 0px -40px 0px",
      }
    );

    timelineItems.forEach((item) => activeObserver.observe(item));
  }
} else {
  // запасной вариант для старых браузеров
  revealElements.forEach((el) => el.classList.add("js-reveal--visible"));
}

// Интерактив для "Нашей истории" — раскрытие деталей по клику/тачу
if (timelineItems.length > 0) {
  timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
      const isExpanded = item.classList.contains("timeline-item--expanded");
      // Сворачиваем остальные
      timelineItems.forEach((el) => el.classList.remove("timeline-item--expanded"));
      // Если этот уже был открыт, просто закрываем все; иначе открываем его
      if (!isExpanded) {
        item.classList.add("timeline-item--expanded");
      }
    });
  });
}

// Обработка анкеты гостя
const rsvpForm = document.getElementById("rsvpForm");
const rsvpResult = document.getElementById("rsvpResult");

if (rsvpForm && rsvpResult) {
  rsvpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(rsvpForm);
    const guestName = (formData.get("guestName") || "").toString().trim();
    const notes = (formData.get("notes") || "").toString().trim();

    const drinks = formData.getAll("drinks").map(String);
    const food = formData.getAll("food").map(String);

    const lines = [];

    if (guestName) {
      lines.push(`Имя гостя: ${guestName}`);
    }

    lines.push(
      `Напитки: ${drinks.length > 0 ? drinks.join(", ") : "оставляю выбор за вами"}`
    );

    lines.push(
      `Еда: ${food.length > 0 ? food.join(", ") : "подойдёт любое меню без ограничений"}`
    );

    if (notes) {
      lines.push(`Пожелания: ${notes}`);
    }

    const summary = lines.join("\n");

    rsvpResult.innerHTML = `
      <p><strong>Спасибо!</strong> Ниже — краткое резюме вашего выбора.</p>
      <pre>${summary}</pre>
      <p style="margin-top: 6px; font-size: 12px; color: #8e7a60;">
        При желании вы можете скопировать этот текст и отправить его нам
        сообщением.
      </p>
    `;

    rsvpResult.classList.add("rsvp-result--visible");

    // Дополнительно прокрутим страницу к результату, если он ниже
    rsvpResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

// (Музыка была убрана по просьбе — логика не требуется)

