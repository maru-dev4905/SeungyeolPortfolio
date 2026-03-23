import { useMemo, useState } from 'react'

import { LegacyBanner } from '../components/common/LegacyBanner'
import { useLegacyPage } from '../hooks/useLegacyPage'

const korOptions = ['협업', '의뢰', '채용', '기타']
const engOptions = ['collaboration', 'project', 'hiring', 'others']

export function ContactPage() {
  const [language, setLanguage] = useState<'kor' | 'eng'>('kor')
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('')

  useLegacyPage('LeeSeungyeol - CONTACT ME', 'sub')

  const options = useMemo(
    () => (language === 'kor' ? korOptions : engOptions),
    [language],
  )

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
        firstLine={['EACH', 'PROJECT', '/', 'BEGINS', 'WITH', 'AN', 'IDEA', '/', 'AND', 'GROWS', 'THROUGH', 'DETAIL.']}
        secondLine={['EVERY', 'PIXEL', '/', 'EVERY', 'MOTION', '/', 'EVERY', 'LINE', '/', 'TELLS', 'A', 'STORY.']}
      />

      <section className="sec_contact">
        <div className="inner">
          <div className="lang">
            <button
              type="button"
              className={language === 'kor' ? 'kor_btn target on' : 'kor_btn target'}
              onClick={() => {
                setLanguage('kor')
                setSelectedType('')
                setIsSelectOpen(false)
              }}
            >
              KOR
            </button>
            <div></div>
            <button
              type="button"
              className={language === 'eng' ? 'eng_btn target on' : 'eng_btn target'}
              onClick={() => {
                setLanguage('eng')
                setSelectedType('')
                setIsSelectOpen(false)
              }}
            >
              ENG
            </button>
          </div>

          <div className={language === 'kor' ? 'kor on' : 'kor'}>
            <form action="#" method="POST" id="kor_mail">
              <div className="col fade anim">
                <p>안녕하세요,</p>
                <label htmlFor="kor_company" className="hidden"></label>
                <input type="text" placeholder="회사명을 입력해주세요" id="kor_company" />
                <p>의</p>
                <label htmlFor="kor_name" className="hidden"></label>
                <input type="text" placeholder="이름을 입력해주세요" id="kor_name" />
                <p>입니다.</p>
              </div>
              <div className="col fade anim">
                <p>연락 가능한 이메일은</p>
                <label htmlFor="kor_email" className="hidden"></label>
                <input type="text" placeholder="이메일을 입력해주세요" id="kor_email" />
                <p>입니다.</p>
              </div>
              <div className="col fade anim">
                <p>문의 유형은</p>
                <div
                  className={
                    selectedType
                      ? isSelectOpen
                        ? 'select_wrap on val'
                        : 'select_wrap val'
                      : isSelectOpen
                        ? 'select_wrap on'
                        : 'select_wrap'
                  }
                >
                  <button
                    type="button"
                    className="select_btn"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                  >
                    {selectedType || '유형'}
                  </button>
                  <div className="options">
                    {options.map((option, index) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`kor_type_${index}`}
                          name="kor_type"
                          value={option}
                          checked={selectedType === option}
                          onChange={() => {
                            setSelectedType(option)
                            setIsSelectOpen(false)
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
                <label htmlFor="kor_description" className="hidden"></label>
                <textarea id="kor_description" placeholder="내용을 입력해주세요"></textarea>
                <p>입니다.</p>
              </div>
              <button type="submit" className="target">
                SEND
              </button>
            </form>
          </div>

          <div className={language === 'eng' ? 'eng on' : 'eng'}>
            <form action="#" method="POST" id="eng_mail">
              <div className="col fade anim">
                <p>Hello, I&apos;m</p>
                <label htmlFor="eng_name" className="hidden"></label>
                <input type="text" placeholder="name" id="eng_name" />
                <p>from</p>
                <label htmlFor="eng_company" className="hidden"></label>
                <input type="text" placeholder="company" id="eng_company" />
              </div>
              <div className="col fade anim">
                <p>You can reach me via</p>
                <label htmlFor="eng_email" className="hidden"></label>
                <input type="text" placeholder="email" id="eng_email" />
              </div>
              <div className="col fade anim">
                <p>This inquiry is about</p>
                <div
                  className={
                    selectedType
                      ? isSelectOpen
                        ? 'select_wrap on val'
                        : 'select_wrap val'
                      : isSelectOpen
                        ? 'select_wrap on'
                        : 'select_wrap'
                  }
                >
                  <button
                    type="button"
                    className="select_btn"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                  >
                    {selectedType || 'Type'}
                  </button>
                  <div className="options">
                    {options.map((option, index) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={`eng_type_${index}`}
                          name="eng_type"
                          value={option}
                          checked={selectedType === option}
                          onChange={() => {
                            setSelectedType(option)
                            setIsSelectOpen(false)
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
                <label htmlFor="eng_description" className="hidden"></label>
              </div>
              <textarea id="eng_description" placeholder="message"></textarea>
              <button type="submit" className="target">
                SEND
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
