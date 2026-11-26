document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const PRIMARY_WA_INTL = "966558040567";
  const PRIMARY_PHONE_DISPLAY = "0558040567";

  const progressBar = document.getElementById("scrollProgressBar");
  const siteHeader = document.getElementById("siteHeader");
  const backToTopBtn = document.getElementById("backToTopBtn");

  const handleScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    if (progressBar) {
      progressBar.style.transform = `scaleX(${ratio})`;
    }
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", scrollTop > 32);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollTop > 420);
    }
  };

  window.addEventListener("scroll", handleScrollUI, { passive: true });
  handleScrollUI();

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const revealElements = document.querySelectorAll(".reveal-up");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  }

  const counterElements = document.querySelectorAll(".counter-num");
  const animateCounter = (el) => {
    const target = Number(el.dataset.target || 0);
    if (prefersReducedMotion) {
      el.textContent = String(target);
      return;
    }
    const duration = 1100;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = String(Math.round(target * eased));
      if (elapsed < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counterElements.forEach((el) => counterObserver.observe(el));
  } else {
    counterElements.forEach((el) => {
      el.textContent = el.dataset.target || "0";
    });
  }

  const mobileSheetToggle = document.getElementById("mobileSheetToggle");
  const mobileSheetClose = document.getElementById("mobileSheetClose");
  const mobileBottomSheet = document.getElementById("mobileBottomSheet");
  const mobileSheetBackdrop = document.getElementById("mobileSheetBackdrop");
  const bottomNavItems = document.querySelectorAll(".bottom-nav-item");

  const setBottomSheetState = (isOpen) => {
    if (!mobileBottomSheet || !mobileSheetBackdrop || !mobileSheetToggle) return;
    mobileBottomSheet.classList.toggle("is-open", isOpen);
    mobileSheetBackdrop.classList.toggle("is-open", isOpen);
    mobileBottomSheet.setAttribute("aria-hidden", String(!isOpen));
    mobileSheetBackdrop.setAttribute("aria-hidden", String(!isOpen));
    mobileSheetToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  if (mobileSheetToggle) {
    mobileSheetToggle.addEventListener("click", () => {
      const willOpen = !mobileBottomSheet.classList.contains("is-open");
      setBottomSheetState(willOpen);
    });
  }

  if (mobileSheetClose) {
    mobileSheetClose.addEventListener("click", () => setBottomSheetState(false));
  }

  if (mobileSheetBackdrop) {
    mobileSheetBackdrop.addEventListener("click", () => setBottomSheetState(false));
  }

  document.querySelectorAll(".sheet-nav-link").forEach((link) => {
    link.addEventListener("click", () => setBottomSheetState(false));
  });

  bottomNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      bottomNavItems.forEach((b) => b.classList.remove("active"));
      item.classList.add("active");
    });
  });

  const lightboxModal = document.getElementById("workLightboxModal");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const lightboxCloseBtn = document.getElementById("lightboxCloseBtn");
  const lightboxPrevBtn = document.getElementById("lightboxPrevBtn");
  const lightboxNextBtn = document.getElementById("lightboxNextBtn");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaptionTitle = document.getElementById("lightboxCaptionTitle");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxInquiryBtn = document.getElementById("lightboxInquiryBtn");

  const galleryCards = Array.from(document.querySelectorAll("#worksGalleryGrid .work-trigger"));
  const galleryItems = galleryCards.map((card) => ({
    src: card.dataset.img,
    title: card.dataset.title || "مشروع من أعمال أبو سلطان"
  }));

  let currentLightboxIdx = 0;

  const renderLightboxSlide = (index) => {
    if (!galleryItems.length) return;
    currentLightboxIdx = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentLightboxIdx];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;
    lightboxCaptionTitle.textContent = item.title;
    lightboxCounter.textContent = `صورة ${currentLightboxIdx + 1} من ${galleryItems.length}`;
  };

  const openLightbox = (src, title, explicitIndex) => {
    if (!lightboxModal) return;
    if (typeof explicitIndex === "number" && !Number.isNaN(explicitIndex)) {
      renderLightboxSlide(explicitIndex);
    } else {
      const matchedIndex = galleryItems.findIndex((item) => item.src === src);
      if (matchedIndex >= 0) {
        renderLightboxSlide(matchedIndex);
      } else {
        lightboxImg.src = src;
        lightboxImg.alt = title || "معاينة عمل أبو سلطان";
        lightboxCaptionTitle.textContent = title || "أعمال مؤسسة أبو سلطان";
        lightboxCounter.textContent = "معاينة المشروع";
      }
    }
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxCloseBtn.focus();
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".work-trigger").forEach((trigger) => {
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("role", "button");
    trigger.addEventListener("click", () => {
      const idx = trigger.dataset.index !== undefined ? Number(trigger.dataset.index) : undefined;
      openLightbox(trigger.dataset.img, trigger.dataset.title, idx);
    });
    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const idx = trigger.dataset.index !== undefined ? Number(trigger.dataset.index) : undefined;
        openLightbox(trigger.dataset.img, trigger.dataset.title, idx);
      }
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener("click", () => renderLightboxSlide(currentLightboxIdx - 1));
  if (lightboxNextBtn) lightboxNextBtn.addEventListener("click", () => renderLightboxSlide(currentLightboxIdx + 1));
  if (lightboxInquiryBtn) {
    lightboxInquiryBtn.addEventListener("click", () => {
      const msgField = document.getElementById("cfMessage");
      if (msgField && lightboxCaptionTitle.textContent) {
        msgField.value = `أرغب في طلب عرض سعر مشابه لـ: ${lightboxCaptionTitle.textContent}`;
      }
      closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightboxModal && lightboxModal.classList.contains("is-open")) {
        closeLightbox();
      }
      if (mobileBottomSheet && mobileBottomSheet.classList.contains("is-open")) {
        setBottomSheetState(false);
      }
    } else if (lightboxModal && lightboxModal.classList.contains("is-open")) {
      if (e.key === "ArrowLeft") renderLightboxSlide(currentLightboxIdx + 1);
      if (e.key === "ArrowRight") renderLightboxSlide(currentLightboxIdx - 1);
    }
  });

  const epoxyData = {
    industrial: {
      tag: "الأكثر طلباً للمستودعات",
      title: "إيبوكسي المستودعات والمصانع عالي التحمل (Self-Leveling)",
      desc: "نظام أرضيات إيبوكسي صناعي من ثلاث طبقات بعد جلي الخرسانة بالماس وفتح المسام، يتحمل مرور الرافعات الشوكية والشاحنات ويمنع تطاير الغبار الخرساني تماماً.",
      thickness: "2 – 3 ملم",
      strength: "75 نيوتن/مم²",
      cure: "48 – 72 ساعة",
      warranty: "10 سنوات",
      swatch: "linear-gradient(135deg, #2B3948, #0B6E5B)"
    },
    garage: {
      tag: "حماية المواقف والورش",
      title: "إيبوكسي مواقف السيارات والجراجات المقاوم للزيوت",
      desc: "طلاء إيبوكسي مرن مع طبقة مانعة للانزلاق ومقاومة لاحتكاك الإطارات الساخنة وتسربات الزيوت والبنزين وأملاح المياه.",
      thickness: "1.5 – 2 ملم",
      strength: "65 نيوتن/مم²",
      cure: "36 – 48 ساعة",
      warranty: "8 سنوات",
      swatch: "linear-gradient(135deg, #3D4550, #D49434)"
    },
    metallic: {
      tag: "تشطيب فاخر بدون فواصل",
      title: "إيبوكسي ميتاليك و 3D للفلل والمعارض التجارية",
      desc: "أرضيات ديكورية بلمعان زجاجي وتأثيرات رخامية أو معدنية انسيابية خالية من الترويبة والفواصل وسهلة التنظيف للغاية.",
      thickness: "2 – 3.5 ملم",
      strength: "60 نيوتن/مم²",
      cure: "48 ساعة",
      warranty: "7 سنوات",
      swatch: "linear-gradient(135deg, #8E5B0E, #E8AE4E)"
    },
    antislip: {
      tag: "المعايير الصحية والغذائية",
      title: "إيبوكسي صحي مضاد للبكتيريا والرطوبة والانزلاق",
      desc: "مثالي للمطابخ المركزية والمستودعات الغذائية وغرف الكهرباء، خالٍ من المسام ولا يسمح بنمو الفطريات مع سهولة الغسل المستمر.",
      thickness: "2 ملم",
      strength: "70 نيوتن/مم²",
      cure: "48 ساعة",
      warranty: "10 سنوات",
      swatch: "linear-gradient(135deg, #075143, #17A589)"
    }
  };

  document.querySelectorAll(".epoxy-option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".epoxy-option-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const data = epoxyData[btn.dataset.epoxy];
      if (!data) return;
      document.getElementById("epoxyTag").textContent = data.tag;
      document.getElementById("epoxyTitle").textContent = data.title;
      document.getElementById("epoxyDesc").textContent = data.desc;
      document.getElementById("epoxyThickness").textContent = data.thickness;
      document.getElementById("epoxyStrength").textContent = data.strength;
      document.getElementById("epoxyCure").textContent = data.cure;
      document.getElementById("epoxyWarranty").textContent = data.warranty;
      document.getElementById("epoxySwatch").style.background = data.swatch;
    });
  });

  const warrantyInfo = {
    shades: {
      title: "ضمان المظلات والبرجولات الحديدية والـ PVC",
      years: "ضمان 10 سنوات",
      desc: "يشمل ثبات لون قماش PVC الكوري والألماني وعدم تمزقه، سلامة اللحامات والهياكل الحديدية من الصدأ أو الميلان، ومقاومة الأمطار والرياح."
    },
    hangars: {
      title: "ضمان الهناجر والمستودعات الساندوتش بانل",
      years: "ضمان 15 سنة",
      desc: "ضمان إنشائي على الجملونات والقواعد وسماكات الحديد الفعلية وتثبيت ألواح الساندوتش بانل ومنع تسرب المياه أو الحرارة."
    },
    waterproof: {
      title: "ضمان العوازل المائية والحرارية للأسطح",
      years: "ضمان 10 – 15 سنة",
      desc: "ضمان مكتوب بعدم تسرب مياه الأمطار أو الرطوبة، مع اختبار غمر فعلي قبل التسليم وصيانة مجانية لأي فواصل."
    },
    epoxy: {
      title: "ضمان أرضيات الإيبوكسي الصناعي والديكوري",
      years: "ضمان 7 – 10 سنوات",
      desc: "يضمن عدم تقشر الطبقة أو انفصالها عن الخرسانة بفضل الجلي الماسي المسبق ومقاومة الزيوت والاحتكاك اليومي."
    }
  };

  document.querySelectorAll(".warranty-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".warranty-pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      const info = warrantyInfo[pill.dataset.w];
      if (!info) return;
      document.getElementById("wTitle").textContent = info.title;
      document.getElementById("wYears").textContent = info.years;
      document.getElementById("wDesc").textContent = info.desc;
    });
  });

  const areaSearchInput = document.getElementById("areaSearchInput");
  const areaPills = document.querySelectorAll("#areasGrid .area-pill");
  const areaSelectedBanner = document.getElementById("areaSelectedBanner");

  if (areaSearchInput) {
    areaSearchInput.addEventListener("input", () => {
      const q = areaSearchInput.value.trim();
      areaPills.forEach((pill) => {
        const match = !q || pill.dataset.area.includes(q);
        pill.style.display = match ? "inline-flex" : "none";
      });
    });
  }

  areaPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      areaPills.forEach((p) => p.classList.remove("selected"));
      pill.classList.add("selected");
      const chosenArea = pill.dataset.area;

      const cfArea = document.getElementById("cfArea");
      if (cfArea) cfArea.value = chosenArea;

      if (areaSelectedBanner) {
        const span = areaSelectedBanner.querySelector("span");
        if (span) {
          span.textContent = `تم تحديد (${chosenArea}) بنجاح! اضغط لتأكيد المعاينة المجانية في حيك.`;
        }
      }
    });
  });

  document.querySelectorAll(".prefill-service").forEach((btn) => {
    btn.addEventListener("click", () => {
      const serviceName = btn.dataset.service;
      const cfService = document.getElementById("cfService");
      if (cfService && serviceName) {
        cfService.value = serviceName;
      }
    });
  });

  const contactForm = document.getElementById("sultanContactForm");
  const formSuccessAlert = document.getElementById("formSuccessAlert");
  const formSuccessMsg = document.getElementById("formSuccessMsg");
  const directWaFallback = document.getElementById("directWaFallback");
  const copyRequestBtn = document.getElementById("copyRequestBtn");

  let lastRequestPayload = "";

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.checkValidity()) {
        event.stopPropagation();
        contactForm.classList.add("was-validated");
        return;
      }

      const name = document.getElementById("cfName").value.trim();
      const phone = document.getElementById("cfPhone").value.trim();
      const area = document.getElementById("cfArea").value;
      const service = document.getElementById("cfService").value;
      const msg = document.getElementById("cfMessage").value.trim() || "طلب معاينة ورفع مقاسات مجاني";

      lastRequestPayload =
        `السلام عليكم مؤسسة أبو سلطان،\n` +
        `طلب معاينة وتسعيرة جديدة:\n` +
        `• الاسم: ${name}\n` +
        `• الجوال: ${phone}\n` +
        `• الحي: ${area}\n` +
        `• الخدمة: ${service}\n` +
        `• التفاصيل: ${msg}`;

      const waUrl = `https://wa.me/${PRIMARY_WA_INTL}?text=${encodeURIComponent(lastRequestPayload)}`;

      if (formSuccessMsg) {
        formSuccessMsg.textContent = `شكراً لك يا ${name} (${area}). تم تجهيز طلب "${service}" لإرساله مباشرة عبر واتساب للرقم الأساسي ${PRIMARY_PHONE_DISPLAY}.`;
      }
      if (directWaFallback) {
        directWaFallback.href = waUrl;
      }
      if (formSuccessAlert) {
        formSuccessAlert.classList.remove("d-none");
      }

      window.open(waUrl, "_blank", "noopener");
    });
  }

  if (copyRequestBtn) {
    copyRequestBtn.addEventListener("click", async () => {
      if (!lastRequestPayload || !navigator.clipboard) return;
      try {
        await navigator.clipboard.writeText(lastRequestPayload);
        copyRequestBtn.textContent = "تم النسخ ✓";
        setTimeout(() => {
          copyRequestBtn.textContent = "نسخ نص الطلب";
        }, 2000);
      } catch {
        copyRequestBtn.textContent = "يرجى النسخ يدوياً";
      }
    });
  }

  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});
// reviews form
(function(){
  const form=document.getElementById("reviewForm"); if(!form) return;
  const picker=document.getElementById("starPicker"); let rating=5;
  const paint=()=>picker.querySelectorAll("button").forEach(b=>b.classList.toggle("on",+b.dataset.v<=rating));
  picker.addEventListener("click",e=>{const b=e.target.closest("button");if(b){rating=+b.dataset.v;paint();}});
  paint();
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const name=document.getElementById("reviewName").value.trim();
    if(!name){document.getElementById("reviewName").focus();return;}
    const msg="تقييم جديد لأبو سلطان\n"+"الاسم: "+name+"\nالخدمة: "+document.getElementById("reviewService").value+"\nالتقييم: "+"★".repeat(rating)+"☆".repeat(5-rating)+"\nالرأي: "+document.getElementById("reviewText").value.trim();
    window.open("https://wa.me/"+PRIMARY_WA_INTL+"?text="+encodeURIComponent(msg),"_blank","noopener");
  });
})();
