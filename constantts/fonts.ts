import { Fraunces, JetBrains_Mono } from "next/font/google";

/**
 * The finished design. Fraunces is a variable serif: at display sizes its
 * optical-size axis gives sharp, high-contrast letterforms, and SOFT rounds
 * the corners slightly so it reads as crafted rather than corporate.
 * To change the headline typeface, change it here and in HEADLINE_STYLE.
 */
export const heroDisplay = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

/** The build view. Only used inside the lens, where the text is meant to look like code. */
export const heroMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});