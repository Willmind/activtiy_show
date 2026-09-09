import {
  ArrowUpRight,
  Mail,
  Download,
  CalendarCheck,
  Coins,
  Building2,
  ClipboardList,
} from 'lucide-react';

const capabilities = [
  {
    icon: CalendarCheck,
    title: '活动统筹与员工关怀',
    text: '统筹年会、节日活动及团建，协调物资采购、现场人员与跨部门协作。',
  },
  {
    icon: Coins,
    title: '费用分析与成本管控',
    text: '月度行政费用分析、账单核对与采购比价，兼顾服务质量和预算管理。',
  },
  {
    icon: Building2,
    title: '办公空间与环境运维',
    text: '办公区域巡检、场地扩租支持、工位规划及后勤服务保障。',
  },
  {
    icon: ClipboardList,
    title: '流程规范与业务协同',
    text: '编制《行政指南》与餐饮服务规范，梳理采购、对账及后勤流程。',
  },
];

export function ResumeSection() {
  return (
    <>
      <section className="section shell" id="about">
        <div className="section-heading">
          <div>
            <span className="section-number">02 / ABOUT ME</span>
            <h2>做细每一件事，接住每一份信任。</h2>
          </div>
          <a
            className="text-link resume-download"
            href="/resume/zeng-huiyi-resume.pdf?v=c417452a09c2"
            download="应聘行政专员_曾慧仪的简历.pdf"
          >
            <Download size={16} />
            下载完整简历
          </a>
        </div>
        <div className="about-layout">
          <div className="profile-panel">
            <div className="profile-heading">
              <img
                src="/images/portrait.webp"
                width="88"
                height="88"
                alt="曾慧仪"
                loading="lazy"
              />
              <div>
                <h3>曾慧仪</h3>
                <p>行政专员 / 综合行政</p>
              </div>
            </div>
            <p className="profile-copy">
              5
              年行政工作经验，关注活动体验，也重视背后的预算、流程与执行。擅长费用分析、供应商协调与行政标准化，让日常运营更顺畅。
            </p>
            <div className="profile-facts">
              <span>
                求职方向<b>行政专员</b>
              </span>
              <span>
                到岗时间<b>随时到岗</b>
              </span>
              <span>
                教育背景<b>工商企业管理 · 大专</b>
              </span>
            </div>
            <a className="profile-email" href="mailto:zhy01161213@163.com">
              <Mail size={17} />
              zhy01161213@163.com
              <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="capability-grid">
            {capabilities.map((item) => (
              <article className="capability" key={item.title}>
                <item.icon size={23} strokeWidth={1.5} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="achievement-strip">
          <div className="achievement-caption">
            工作成果<span>广州汇量 · 行政支持岗</span>
          </div>
          <div>
            <strong>
              50<span>人</span>
            </strong>
            <p>独立统筹年会</p>
          </div>
          <div>
            <strong>
              90<span>%+</span>
            </strong>
            <p>活动员工参与率</p>
          </div>
          <div>
            <strong>
              7.37<span>%</span>
            </strong>
            <p>年会支出低于预算</p>
          </div>
          <div>
            <strong>
              100<span>+ 笔</span>
            </strong>
            <p>账单核对零差错</p>
          </div>
        </div>
      </section>
      <section className="experience-section shell">
        <div className="experience-heading">
          <span className="section-number">EXPERIENCE & EDUCATION</span>
          <h2>经历，积累在每一次落实里。</h2>
        </div>
        <div className="timeline">
          <article className="timeline-row">
            <time>2025.07 — 2026.06</time>
            <div className="timeline-content">
              <div className="timeline-title">
                <h3>广州汇量网络科技股份有限公司</h3>
                <span>行政支持岗</span>
              </div>
              <p>
                负责活动统筹、行政费用分析、办公环境运维与员工后勤保障，推进行政流程标准化。
              </p>
              <ul>
                <li>独立负责 50 人年会、4 场节日活动与 2 场团建。</li>
                <li>编制《行政指南》，推动事务处理效率提升 50%。</li>
                <li>支撑办公场地扩租，7 日内输出工位及消防平面图纸。</li>
              </ul>
            </div>
          </article>
          <article className="timeline-row">
            <time>2024.07 — 2025.07</time>
            <div className="timeline-content">
              <div className="timeline-title">
                <h3>广州中转信息科技有限责任公司</h3>
                <span>行政专员</span>
              </div>
              <p>
                负责工商事务、企业文化活动、考勤与资产管理，协调办公环境优化项目。
              </p>
              <ul>
                <li>策划执行 6 场企业文化活动，平均参与率 85%。</li>
                <li>完成 12+ 次工商变更，管理 10+ 主体证照与台账。</li>
                <li>主导 2 次办公环境升级，协调 5 个部门需求。</li>
              </ul>
            </div>
          </article>
          <article className="timeline-row education-row">
            <time>2018.09 — 2021.06</time>
            <div className="timeline-content">
              <div className="timeline-title">
                <h3>广州工商学院</h3>
                <span>工商企业管理 · 大专</span>
              </div>
            </div>
          </article>
        </div>
      </section>
      <section className="contact-section" id="contact">
        <div className="shell contact-inner">
          <div>
            <span className="section-number">03 / LET’S CONNECT</span>
            <h2>
              期待把这份用心，
              <br />
              带到新的团队。
            </h2>
            <p>欢迎就行政专员岗位与我联系。</p>
          </div>
          <div className="contact-actions">
            <a className="contact-email" href="mailto:zhy01161213@163.com">
              zhy01161213@163.com
              <ArrowUpRight size={25} />
            </a>
            <a
              className="text-link"
              href="/resume/zeng-huiyi-resume.pdf?v=c417452a09c2"
              download="应聘行政专员_曾慧仪的简历.pdf"
            >
              <Download size={16} />
              下载简历 PDF
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
