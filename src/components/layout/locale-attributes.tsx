"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export function LocaleAttributes() {
  const locale = useLocale();
  const dir = ["he", "ar"].includes(locale) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  return null;
}
