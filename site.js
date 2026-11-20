"use strict";

const words = {
  title: "《师傅！停车！》",
  skip: "跳到主要内容",
  navigation: "主导航",
  language: "语言",
  menu: "菜单",
  gameplay: "玩法",
  experience: "体验",
  experienceIntro: "照常发车。到站时请清点乘客、同事和剩余车身。",
  rivalVideo: "敌对公交追撞",
  rivalVideoText: "野狗镇 · 隔壁公司的司机贴上来谈竞争。双方都掉了几块车皮。",
  trafficVideo: "车流失控",
  trafficVideoText: "蚂蚁镇 · 前车踩了脚刹车，后面整条街都跟着加戏。",
  driftVideo: "公交漂移",
  driftVideoText: "蟋蟀镇 · 手册规定整辆车都得过弯。横着过也算。",
  playVideo: "播放视频",
  downloadVideo: "下载 MP4",
  media: "截图",
  about: "关于",
  contact: "联系",
  development: "开发中",
  tagline: "四个人，一辆公交，没一个靠谱。",
  summary: "一款 1–4 人合作喜剧。一起经营公交线路，顺便把它搞砸。",
  watch: "看实机",
  platform: "Windows PC · Steam",
  artCredit: "宣传渲染 · 蟋蟀镇",
  gameplayClip: "实机画面",
  footageTitle: "蟋蟀镇的\n一班车。",
  footageText: "路线已经排好，时刻表也写好了。至于车上那几位，他们有自己的安排。",
  stopAlt: "绿白相间的老式公交停靠在蟋蟀镇主路的站台旁。",
  clipLabel: "蟋蟀镇游戏实机短片",
  playClip: "播放短片",
  pauseClip: "暂停短片",
  footageCaption: "蟋蟀镇 · 游戏内录制",
  drive: "驾驶",
  driveText: "握紧方向盘，跑完线路，靠站上下客。顺便想办法让一整辆公交穿过城里的车流。",
  driveAlt: "老式公交驶过蟋蟀镇主路和两侧的低楼。",
  survive: "事件",
  surviveText: "卖票、听投诉，再看看过道里出了什么事。运气好的话，同事还能搭把手。",
  surviveAlt: "老奶奶在车厢过道挥拐，两位玩家慌忙闪避。",
  chaos: "混乱",
  chaosText: "一个操作失误，人、道具和公交车零件都可能飞出去。接下来的麻烦多半也是你们自己惹的。",
  chaosAlt: "公交散架时，车窗框架和车身面板飞过蟋蟀镇主路。",
  galleryIntro: "在蟋蟀镇拍摄的游戏截图。选择图片即可放大查看。",
  photoDashboard: "坐上驾驶位",
  photoTown: "蟋蟀镇的主路",
  photoSurvive: "过道里出事了",
  photoChaos: "零件另售",
  photoCoop: "两个人同一班",
  photoStop: "公交到站",
  aboutTitle: "一家非常正常的\n公交公司。",
  aboutGame: "最多四人一起运营公交。照顾好乘客，保住车，顺便管管你的同事。祝你好运。",
  planned: "Windows PC · 计划登陆 Steam",
  studio: "两个人的独立游戏团队，专做一起玩就容易乱起来的游戏。",
  business: "商务联系",
  backTop: "返回顶部",
  closeImage: "关闭大图",
};

const textNodes = [...document.querySelectorAll("[data-t]")].map((node) => ({
  node,
  english: [...node.childNodes].map((part) => part.nodeName === "BR" ? "\n" : part.textContent).join("").trim(),
}));
const altNodes = [...document.querySelectorAll("[data-alt]")].map((node) => [node, node.alt]);
const labelNodes = [...document.querySelectorAll("[data-label]")].map((node) => [node, node.getAttribute("aria-label")]);
const languageButtons = document.querySelectorAll("[data-language]");
const wordmark = document.querySelector(".wordmark");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const pointer = window.matchMedia("(min-width: 761px) and (hover: hover) and (pointer: fine)");
const languageKey = "driverstop:language";
const description = document.querySelector('meta[name="description"]');
const englishDescription = description.content;
const englishTitle = document.title;
let language = "en";

function startingLanguage() {
  try {
    const saved = localStorage.getItem(languageKey);
    if (saved === "en" || saved === "zh") return saved;
  } catch {
    // Language selection still works if storage access is restricted.
  }
  return /^zh(?:-|$)/i.test(navigator.languages?.[0] || navigator.language) ? "zh" : "en";
}

function setLanguage(next) {
  language = next;
  const chinese = next === "zh";
  document.documentElement.lang = chinese ? "zh-CN" : "en";
  document.title = chinese ? `${words.title} — Wild Current Studio` : englishTitle;
  description.content = chinese ? `${words.tagline} ${words.summary}` : englishDescription;
  for (const {node, english} of textNodes) node.textContent = chinese ? words[node.dataset.t] : english;
  for (const [node, english] of altNodes) node.alt = chinese ? words[node.dataset.alt] : english;
  for (const [node, english] of labelNodes) node.setAttribute("aria-label", chinese ? words[node.dataset.label] : english);
  if (wordmark) {
    wordmark.src = `./assets/wordmark-${next}.webp`;
    wordmark.width = chinese ? 872 : 1035;
    wordmark.height = chinese ? 574 : 521;
  }
  for (const button of languageButtons) button.setAttribute("aria-pressed", String(button.dataset.language === next));
  document.dispatchEvent(new Event("site-language"));
}

setLanguage(startingLanguage());
for (const button of languageButtons) {
  button.addEventListener("click", () => {
    const next = button.dataset.language;
    if (next === language) return;
    setLanguage(next);
    try {
      localStorage.setItem(languageKey, next);
    } catch {
      // This selection still applies until reload.
    }
  });
}

const header = document.querySelector(".site-header");
const nav = document.querySelector(".site-nav");
const menu = document.querySelector(".menu-toggle");
let lastScroll = window.scrollY;
let scrollQueued = false;

function closeMenu() {
  nav.classList.remove("is-open");
  menu.setAttribute("aria-expanded", "false");
}

menu.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menu.setAttribute("aria-expanded", String(open));
  header.classList.remove("is-away");
});
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener("pointerdown", (event) => {
  if (!header.contains(event.target)) closeMenu();
});
window.addEventListener("scroll", () => {
  if (scrollQueued) return;
  scrollQueued = true;
  window.requestAnimationFrame(() => {
    scrollQueued = false;
    const position = Math.max(0, window.scrollY);
    const delta = position - lastScroll;
    if (position <= 16) header.classList.remove("is-away");
    if (Math.abs(delta) < 6) return;
    lastScroll = position;
    header.classList.toggle("is-away", position > header.offsetHeight && delta > 0 && !nav.classList.contains("is-open"));
  });
}, { passive: true });
window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

const hero = document.querySelector(".hero");
const art = document.querySelector(".hero-art");
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let motionFrame = 0;

function animateHero() {
  currentX += (targetX - currentX) * .16;
  currentY += (targetY - currentY) * .16;
  const settled = Math.abs(targetX - currentX) < .06 && Math.abs(targetY - currentY) < .06;
  art.style.setProperty("--mx", `${(settled ? targetX : currentX).toFixed(2)}px`);
  art.style.setProperty("--my", `${(settled ? targetY : currentY).toFixed(2)}px`);
  motionFrame = settled ? 0 : window.requestAnimationFrame(animateHero);
}

function resetHero() {
  targetX = 0;
  targetY = 0;
  if (!motionFrame) motionFrame = window.requestAnimationFrame(animateHero);
}

hero?.addEventListener("pointermove", (event) => {
  if (!pointer.matches || reduced.matches || event.pointerType === "touch") return;
  const bounds = hero.getBoundingClientRect();
  targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 36;
  targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 23;
  if (!motionFrame) motionFrame = window.requestAnimationFrame(animateHero);
}, { passive: true });
if (hero) {
  hero.addEventListener("pointerleave", resetHero);
  pointer.addEventListener("change", resetHero);
  reduced.addEventListener("change", resetHero);
}

if ("IntersectionObserver" in window) {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: .08 });
  document.documentElement.classList.add("motion-ready");
  for (const element of reveals) observer.observe(element);
}

const lightbox = document.querySelector(".lightbox");
const fullImage = lightbox?.querySelector("img");
const imageCaption = lightbox?.querySelector("figcaption");
const closeImage = lightbox?.querySelector("button");
let activePhoto = null;

for (const photo of document.querySelectorAll("[data-gallery]")) {
  photo.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || typeof lightbox.showModal !== "function") return;
    event.preventDefault();
    activePhoto = photo;
    const caption = photo.querySelector("span").textContent;
    fullImage.src = photo.href;
    fullImage.alt = caption;
    imageCaption.textContent = caption;
    lightbox.showModal();
    closeImage.focus();
  });
}
closeImage?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener("close", () => {
  fullImage.removeAttribute("src");
  activePhoto?.focus({ preventScroll: true });
  activePhoto = null;
});

const footage = document.querySelector("[data-clip]");
const video = footage?.querySelector("video");
const clipButton = footage?.querySelector("button");
const canPlay = video?.canPlayType("video/mp4") && Boolean(footage.dataset.clip);
const reelVideos = [...document.querySelectorAll(".reel-panel video")];
let clipVisible = false;
let wantsClip = null;

function clipLabel() {
  clipButton.textContent = video.paused
    ? (language === "zh" ? words.playClip : "Play clip")
    : (language === "zh" ? words.pauseClip : "Pause clip");
}

function syncVideo() {
  const autoplay = pointer.matches && !reduced.matches && !navigator.connection?.saveData;
  if (document.hidden || !clipVisible || !(wantsClip ?? autoplay) || reelVideos.some((reel) => !reel.paused && !reel.ended)) {
    video.pause();
    return;
  }
  if (!video.getAttribute("src")) video.src = footage.dataset.clip;
  video.play().catch(clipLabel);
}

if (canPlay) {
  clipButton.hidden = false;
  clipButton.addEventListener("click", () => {
    wantsClip = video.paused;
    syncVideo();
  });
  video.addEventListener("playing", () => {
    footage.classList.add("has-video");
    clipLabel();
  });
  video.addEventListener("pause", clipLabel);
  video.addEventListener("error", () => {
    footage.classList.remove("has-video");
    clipButton.hidden = true;
    wantsClip = false;
  });
  document.addEventListener("visibilitychange", syncVideo);
  document.addEventListener("site-language", clipLabel);
  pointer.addEventListener("change", syncVideo);
  reduced.addEventListener("change", syncVideo);
  if ("IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      clipVisible = entry.intersectionRatio >= .24;
      syncVideo();
    }, { threshold: [0, .24] });
    videoObserver.observe(footage);
  } else {
    clipVisible = true;
  }
}

if (reelVideos.length) {
  const reelObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
    for (const {isIntersecting, target} of entries) {
      if (!isIntersecting && !target.paused && target !== document.fullscreenElement && target !== document.pictureInPictureElement) target.pause();
    }
  }) : null;
  for (const reel of reelVideos) {
    const startButton = reel.parentElement.querySelector(".reel-play");
    if (reel.canPlayType("video/mp4")) {
      reel.controls = false;
      startButton.hidden = false;
      const showControls = () => {
        reel.controls = true;
        if (document.activeElement === startButton) reel.focus();
        startButton.hidden = true;
      };
      startButton.addEventListener("click", () => reel.play().catch(showControls));
      reel.addEventListener("playing", showControls, { once: true });
    }
    reel.addEventListener("play", () => {
      video?.pause();
      for (const other of reelVideos) if (other !== reel && !other.paused) other.pause();
    });
    if (canPlay) {
      reel.addEventListener("pause", syncVideo);
      reel.addEventListener("ended", syncVideo);
    }
    reelObserver?.observe(reel);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) for (const reel of reelVideos) reel.pause();
  });
}
