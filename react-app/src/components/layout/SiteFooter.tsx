import { useCallback, useEffect } from "react";

import { disposeCopyToast, showCopyToast } from "../../utils/bodyToasts";

export function SiteFooter() {
  useEffect(() => {
    return () => {
      disposeCopyToast();
    };
  }, []);

  const copyValue = useCallback(
    async (value: string) => {
      let ok = false;

      try {
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          await navigator.clipboard.writeText(value);
          ok = true;
        }
      } catch {
        ok = false;
      }

      if (!ok) {
        try {
          // insecure context 대응(로컬/깃헙 pages): 임시 textarea fallback
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.left = "-9999px";
          ta.style.top = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          ok = true;
        } catch {
          ok = false;
        }
      }

      showCopyToast(ok ? "복사가 완료되었습니다" : "복사가 실패했습니다");
    },
    [showCopyToast],
  );

  return (
    <footer>
      <div className="line">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <span></span>
      </div>
      <div className="inner">
        <div className="links">
          <div>
            <div>
              <strong>LINK :</strong>
              <a href="https://github.com/maru-dev4905" className="target">
                Github
              </a>
              <a
                href="https://www.facebook.com/seungyeol.lee.522/"
                className="target"
              >
                Facebook
              </a>
              <a href="https://www.instagram.com/syy1_publ/" className="target">
                Instagram
              </a>
              <a href="https://cssbattle.dev/player/maru102" className="target">
                CSS Battles
              </a>
            </div>
          </div>
          <div>
            <strong>CREDITS :</strong>
            <p>Site by Lee-Seungyeol</p>
            <strong>CONTACT :</strong>
            <p>
              <span id="emailTxt">iseung10e@gmail.com</span>{" "}
              <button
                type="button"
                className="copy_btn"
                onClick={() => copyValue("iseung10e@gmail.com")}
              ></button>
            </p>
            <p>
              <span id="phoneNum">010-2269-0763</span>{" "}
              <button
                type="button"
                className="copy_btn"
                onClick={() => copyValue("010-2269-0763")}
              ></button>
            </p>
          </div>
          {/* <div>
            <strong>Resume :</strong>
            <a href="#" className="resume">
              Download Resume _ PDF, 3MB
            </a>
          </div> */}
        </div>
        <div className="desc">
          <div>
            <button
              type="button"
              className="scr_btn target"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            ></button>
            <p>Seungyeol Portfolio - Thanks for your time</p>
            <p>@ 2026 / All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
