import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { TransitionLink, TransitionNavLink } from "../common/TransitionLink";
import {
  scrollLegacyToTop,
  useLegacyInteractions,
} from "../../hooks/useLegacyInteractions";
import { SiteFooter } from "./SiteFooter";

type NavItem =
  | { kind: "internal"; to: string; label: string }
  | { kind: "external"; href: string; label: string };

const navItems: NavItem[] = [
  { kind: "internal", to: "/about", label: "Who I Am" },
  { kind: "internal", to: "/works", label: "My Works" },
  { kind: "internal", to: "/contact", label: "Contact Me" },
  {
    kind: "external",
    href: "https://maru-dev4905.github.io/Weave/docs/css",
    label: "Weave",
  },
];

function getNamespace(pathname: string) {
  if (pathname === "/") {
    return "main" as const;
  }

  if (pathname.startsWith("/works/")) {
    return "work" as const;
  }

  if (pathname.startsWith("/works")) {
    return "works" as const;
  }

  if (pathname.startsWith("/about")) {
    return "about" as const;
  }

  return "contact" as const;
}

export function AppLayout() {
  const location = useLocation();
  const namespace = getNamespace(location.pathname);

  useLegacyInteractions(namespace);

  useEffect(() => {
    document.documentElement.classList.remove("is-changing");
    scrollLegacyToTop();
  }, [location.pathname, location.search, location.hash]);

  return (
    <div className="react-page">
      <div id="intro">
        <div className="item left">
          <svg
            width="50"
            height="228"
            viewBox="0 0 50 228"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="shape left"
          >
            <path
              id="path1"
              className="trace"
              d="M48.7002 0.5V226.7H0.5V222.7H31.9004V5.2998H0.5V0.5H48.7002Z"
            />
          </svg>
        </div>
        <div className="item center">
          <img
            src="/assets/images/visuals/visual.png"
            alt=""
            className="item_img"
          />
        </div>
        <div className="item right">
          <svg
            width="50"
            height="228"
            viewBox="0 0 50 228"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="shape right"
          >
            <path
              id="path2"
              className="trace"
              d="M48.7002 0.5V226.7H0.5V222.7H31.9004V5.2998H0.5V0.5H48.7002Z"
            />
          </svg>
        </div>
      </div>

      <div className="noise-canvas" aria-hidden="true">
        <canvas id="grain"></canvas>
      </div>
      <div className="cursor-outline"></div>
      <div className="cursor-dot"></div>

      <div id="smooth-wrapper">
        <header>
          <div className="inner">
            <h1>
              <TransitionLink to="/" className="target">
                <strong>
                  LEE S<i>E</i>UNG<i>Y</i>EOL <br />P<i>U</i>BLIS<i>H</i>ER
                </strong>
                <span>.PORTFOLIO</span>
                <p>
                  <img
                    src="/assets/images/common/logo_w.png"
                    alt="SY"
                    className="logo"
                  />
                </p>
              </TransitionLink>
            </h1>
            <nav className="gnb">
              <ul>
                {navItems.map((item) => (
                  <li
                    key={item.kind === "internal" ? item.to : item.href}
                    className={
                      item.kind === "internal" &&
                      location.pathname.startsWith(item.to)
                        ? "on"
                        : undefined
                    }
                  >
                    {item.kind === "internal" ? (
                      <TransitionNavLink
                        to={item.to}
                        data-nav={item.label}
                        className="target"
                      >
                        <span>{item.label}</span>
                      </TransitionNavLink>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-nav={item.label}
                        className="target"
                      >
                        <span>{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <button className="menu_btn" type="button"></button>
          </div>
        </header>

        <div className="coordinate_display">
          ( <span className="coordinate_display_x">X: 0px</span>,{" "}
          <span className="coordinate_display_y">Y: 0px</span> )
        </div>

        <div id="smooth-content">
          <div
            className="page transition-fade"
            data-swup="container"
            data-namespace={namespace}
          >
            <Outlet />
            <SiteFooter />
          </div>
        </div>
      </div>

      <div id="swup-overlay" aria-hidden="true"></div>
    </div>
  );
}
