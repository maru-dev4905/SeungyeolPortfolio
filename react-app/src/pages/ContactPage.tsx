import { type FormEvent, useCallback, useMemo, useState } from "react";

import { LegacyBanner } from "../components/common/LegacyBanner";
import { useLegacyPage } from "../hooks/useLegacyPage";
import { showMailResultToast } from "../utils/bodyToasts";

const korOptions = ["협업", "의뢰", "채용", "기타"];
const engOptions = ["collaboration", "project", "hiring", "others"];

const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? "";

export function ContactPage() {
  const [language, setLanguage] = useState<"kor" | "eng">("kor");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [isSending, setIsSending] = useState(false);

  useLegacyPage("LeeSeungyeol - CONTACT ME", "sub");

  const submitToWeb3Forms = useCallback(
    async (payload: { name: string; email: string; message: string }) => {
      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("message", payload.message);
      formData.append("subject", "[Portfolio] Contact");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
      };
      return response.ok && data.success === true;
    },
    [],
  );

  const handleKorSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.reportValidity()) return;

      if (!WEB3FORMS_ACCESS_KEY) {
        showMailResultToast("error");
        return;
      }

      const company =
        (
          document.getElementById("kor_company") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const name =
        (
          document.getElementById("kor_name") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const email =
        (
          document.getElementById("kor_email") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const description =
        (
          document.getElementById(
            "kor_description",
          ) as HTMLTextAreaElement | null
        )?.value?.trim() ?? "";

      const message = [
        `회사: ${company}`,
        `이름: ${name}`,
        `문의 유형: ${selectedType}`,
        "",
        "내용:",
        description,
      ].join("\n");

      setIsSending(true);
      try {
        const ok = await submitToWeb3Forms({ name, email, message });
        if (ok) {
          showMailResultToast("success");
          form.reset();
          setSelectedType("");
          setIsSelectOpen(false);
        } else {
          showMailResultToast("error");
        }
      } catch {
        showMailResultToast("error");
      } finally {
        setIsSending(false);
      }
    },
    [selectedType, submitToWeb3Forms],
  );

  const handleEngSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!form.reportValidity()) return;

      if (!WEB3FORMS_ACCESS_KEY) {
        showMailResultToast("error");
        return;
      }

      const name =
        (
          document.getElementById("eng_name") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const company =
        (
          document.getElementById("eng_company") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const email =
        (
          document.getElementById("eng_email") as HTMLInputElement | null
        )?.value?.trim() ?? "";
      const description =
        (
          document.getElementById(
            "eng_description",
          ) as HTMLTextAreaElement | null
        )?.value?.trim() ?? "";

      const message = [
        `Name: ${name}`,
        `Company: ${company}`,
        `Inquiry type: ${selectedType}`,
        "",
        "Message:",
        description,
      ].join("\n");

      setIsSending(true);
      try {
        const ok = await submitToWeb3Forms({ name, email, message });
        if (ok) {
          showMailResultToast("success");
          form.reset();
          setSelectedType("");
          setIsSelectOpen(false);
        } else {
          showMailResultToast("error");
        }
      } catch {
        showMailResultToast("error");
      } finally {
        setIsSending(false);
      }
    },
    [selectedType, submitToWeb3Forms],
  );

  const options = useMemo(
    () => (language === "kor" ? korOptions : engOptions),
    [language],
  );

  return (
    <main id="contact">
      <section className="sec_visual">
        <div className="inner">
          <em>(</em>
          <em>)</em>
          <h2>
            LET&apos;S START A CONVERSATION. <br />
            OR BUILD SOMETHING TOGETHER.
          </h2>
        </div>
      </section>

      <LegacyBanner
        firstLine={[
          "EACH",
          "PROJECT",
          "/",
          "BEGINS",
          "WITH",
          "AN",
          "IDEA",
          "/",
          "AND",
          "GROWS",
          "THROUGH",
          "DETAIL.",
        ]}
        secondLine={[
          "EVERY",
          "PIXEL",
          "/",
          "EVERY",
          "MOTION",
          "/",
          "EVERY",
          "LINE",
          "/",
          "TELLS",
          "A",
          "STORY.",
        ]}
      />

      <section className="sec_contact">
        <div className="inner">
          <div className="lang">
            <button
              type="button"
              className={
                language === "kor" ? "kor_btn target on" : "kor_btn target"
              }
              onClick={() => {
                setLanguage("kor");
                setSelectedType("");
                setIsSelectOpen(false);
              }}
            >
              KOR
            </button>
            <div></div>
            <button
              type="button"
              className={
                language === "eng" ? "eng_btn target on" : "eng_btn target"
              }
              onClick={() => {
                setLanguage("eng");
                setSelectedType("");
                setIsSelectOpen(false);
              }}
            >
              ENG
            </button>
          </div>

          <div className={language === "kor" ? "kor on" : "kor"}>
            <form id="kor_mail" onSubmit={handleKorSubmit}>
              <div className="col fade anim">
                <p>안녕하세요,</p>
                <label htmlFor="kor_company" className="hidden">
                  회사명
                </label>
                <input
                  type="text"
                  placeholder="회사명을 입력해주세요"
                  id="kor_company"
                  name="kor_company"
                  required
                  autoComplete="organization"
                />
                <p>의</p>
                <label htmlFor="kor_name" className="hidden">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  id="kor_name"
                  name="name"
                  required
                  autoComplete="name"
                />
                <p>입니다.</p>
              </div>
              <div className="col fade anim">
                <p>연락 가능한 이메일은</p>
                <label htmlFor="kor_email" className="hidden">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  id="kor_email"
                  name="email"
                  required
                  autoComplete="email"
                />
                <p>입니다.</p>
              </div>
              <div className="col fade anim">
                <p>문의 유형은</p>
                <div
                  className={
                    selectedType
                      ? isSelectOpen
                        ? "select_wrap on val"
                        : "select_wrap val"
                      : isSelectOpen
                        ? "select_wrap on"
                        : "select_wrap"
                  }
                >
                  <button
                    type="button"
                    className="select_btn"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                  >
                    {selectedType || "유형"}
                  </button>
                  <div className="options">
                    {options.map((option, index) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`kor_type_${index}`}
                          name="kor_type"
                          value={option}
                          required={index === 0}
                          checked={selectedType === option}
                          onChange={() => {
                            setSelectedType(option);
                            setIsSelectOpen(false);
                          }}
                        />
                        <label htmlFor={`kor_type_${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <p>입니다.</p>
              </div>
              <div className="col fade anim">
                <p>자세히 전하고 싶은 내용은</p>
              </div>
              <div className="col fade anim">
                <label htmlFor="kor_description" className="hidden">
                  문의 내용
                </label>
                <textarea
                  id="kor_description"
                  name="message"
                  placeholder="내용을 입력해주세요"
                  required
                ></textarea>
                <p>입니다.</p>
              </div>
              <button type="submit" className="target" disabled={isSending}>
                {isSending ? "전송 중..." : "SEND"}
              </button>
            </form>
          </div>

          <div className={language === "eng" ? "eng on" : "eng"}>
            <form id="eng_mail" onSubmit={handleEngSubmit}>
              <div className="col fade anim">
                <p>Hello, I&apos;m</p>
                <label htmlFor="eng_name" className="hidden">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="name"
                  id="eng_name"
                  name="name"
                  required
                  autoComplete="name"
                />
                <p>from</p>
                <label htmlFor="eng_company" className="hidden">
                  Company
                </label>
                <input
                  type="text"
                  placeholder="company"
                  id="eng_company"
                  name="eng_company"
                  required
                  autoComplete="organization"
                />
              </div>
              <div className="col fade anim">
                <p>You can reach me via</p>
                <label htmlFor="eng_email" className="hidden">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email"
                  id="eng_email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="col fade anim">
                <p>This inquiry is about</p>
                <div
                  className={
                    selectedType
                      ? isSelectOpen
                        ? "select_wrap on val"
                        : "select_wrap val"
                      : isSelectOpen
                        ? "select_wrap on"
                        : "select_wrap"
                  }
                >
                  <button
                    type="button"
                    className="select_btn"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                  >
                    {selectedType || "Type"}
                  </button>
                  <div className="options">
                    {options.map((option, index) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`eng_type_${index}`}
                          name="eng_type"
                          value={option}
                          required={index === 0}
                          checked={selectedType === option}
                          onChange={() => {
                            setSelectedType(option);
                            setIsSelectOpen(false);
                          }}
                        />
                        <label htmlFor={`eng_type_${index}`}>{option}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col">
                <p>Here are the details:</p>
                <label htmlFor="eng_description" className="hidden">
                  Message
                </label>
              </div>
              <textarea
                id="eng_description"
                name="message"
                placeholder="message"
                required
              ></textarea>
              <button type="submit" className="target" disabled={isSending}>
                {isSending ? "Sending..." : "SEND"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
