(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const menuButton = $(".menu-button");
  const nav = $(".nav");
  menuButton?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(Boolean(open)));
  });
  $$(".nav a").forEach(link => link.addEventListener("click", () => {
    nav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }));

  const forceMessages = [
    "正在觀察",
    "紙張重量與重心位置會影響下墜趨勢。",
    "投擲瞬間的動能會隨滑翔逐漸消耗。",
    "迎角過大或機身歪斜時，阻力通常會增加。"
  ];
  $$(".force-card").forEach((card, index, cards) => {
    card.addEventListener("click", () => {
      cards.forEach(item => {
        item.classList.remove("active");
        const more = $(".learn-more", item);
        if (more) more.textContent = "點擊認識";
      });
      card.classList.add("active");
      const more = $(".learn-more", card);
      if (more) more.textContent = forceMessages[index] || "正在觀察";
    });
  });

  const controlBox = $(".controls");
  const sliders = $$("input[type=range]", controlBox);
  const valueLabels = $$("label b", controlBox);
  const resultValues = $$(".sim-results strong");
  const path = $(".sim-path");
  const plane = $(".sim-plane");

  function updateSimulator() {
    if (sliders.length < 3) return;
    const wing = Number(sliders[0].value);
    const weight = Number(sliders[1].value);
    const angle = Number(sliders[2].value);
    if (valueLabels[0]) valueLabels[0].textContent = wing + "%";
    if (valueLabels[1]) valueLabels[1].textContent = weight + "%";
    if (valueLabels[2]) valueLabels[2].textContent = angle + "°";

    const distance = Math.max(8, Math.round(9 + wing * 0.16 + weight * 0.08 - Math.abs(angle - 8) * 0.42));
    const stability = Math.max(45, Math.min(99, Math.round(100 - Math.abs(weight - 62) * 0.5 - Math.abs(angle - 8) * 1.5 - Math.abs(wing - 72) * 0.12)));
    const type = wing > 82 ? "寬翼滑翔" : wing < 58 ? "速度型飛行" : stability > 84 ? "均衡飛行" : "需要微調";

    if (resultValues[0]) resultValues[0].textContent = distance + " m";
    if (resultValues[1]) resultValues[1].textContent = stability + "%";
    if (resultValues[2]) resultValues[2].textContent = type;
    if (path) {
      path.style.width = Math.min(82, 42 + distance * 1.1) + "%";
      path.style.transform = "rotate(" + (-Math.max(1, 8 - angle * 0.45)) + "deg)";
    }
    if (plane) {
      plane.style.left = Math.min(78, 36 + distance * 1.2) + "%";
      plane.style.transform = "rotate(" + (-Math.max(0, 7 - angle * 0.55)) + "deg) scale(" + (0.9 + wing / 1000) + ")";
    }
  }

  sliders.forEach(slider => slider.addEventListener("input", updateSimulator));
  $(".reset-button")?.addEventListener("click", () => {
    [72, 58, 9].forEach((value, index) => {
      if (sliders[index]) sliders[index].value = value;
    });
    updateSimulator();
  });
  updateSimulator();

  const diagnoses = [
    ["機頭立刻向下栽", "機頭太重、投擲角度太低，或升降舵向下。", "把機翼後緣微微向上折；改用水平、較輕柔的投擲。"],
    ["飛機抬頭後失速", "機鼻太輕、仰角太大，或投擲速度不足。", "增加少量機鼻配重，降低仰角，再以平順速度投擲。"],
    ["一直向左或向右偏", "左右翼不對稱，或其中一側的襟翼角度不同。", "從機頭正視檢查對稱，只微調偏移的一側。"],
    ["翻滾、飛行不穩", "上反角不一致、機身扭曲，或投擲時旋轉過多。", "重新壓平摺線，讓兩翼形成一致的淺 V 字。"]
  ];
  const symptomButtons = $$(".symptom-list button");
  const diagnosis = $(".diagnosis-card");
  symptomButtons.forEach((button, index) => button.addEventListener("click", () => {
    symptomButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const item = diagnoses[index];
    if (!item || !diagnosis) return;
    const heading = $("h3", diagnosis);
    const paragraphs = $$("div p", diagnosis);
    if (heading) heading.textContent = item[0];
    if (paragraphs[0]) paragraphs[0].textContent = item[1];
    if (paragraphs[1]) paragraphs[1].textContent = item[2];
  }));

  const filterButtons = $$(".filter-buttons button");
  const resourceCards = $$(".resource-card");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.textContent.trim();
    resourceCards.forEach(card => {
      const region = $(".region", card)?.textContent.trim() || "";
      card.style.display = filter === "全部" || region === filter ? "" : "none";
    });
  }));
})();
