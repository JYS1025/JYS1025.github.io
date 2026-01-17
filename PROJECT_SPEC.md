# Personal Portfolio & Blog Platform (JYS Blog) - Project Specification

## 1. Project Overview (개요)
### 1.1 배경 및 목적 (Why)
기존의 정형화된 블로그 플랫폼(Tistory, Medium 등)은 커스터마이징의 한계가 명확하고, 개발자로서의 기술적 역량을 보여주기에 부족함이 있었습니다. 이에 따라 **Next.js 기반의 자체 블로그 시스템**을 구축하여, 자유로운 디자인 변경과 기능 확장이 가능한 개인 브랜딩 플랫폼을 확보하고자 했습니다.

### 1.2 해결하고자 하는 문제
- **유연성 부족**: 기존 CMS는 테마 수정이 제한적임.
- **콘텐츠 관리의 이원화**: 코드 저장소(GitHub)와 블로그가 분리되어 관리 효율 저하.
- **포트폴리오 연동의 어려움**: 프로젝트 이력과 블로그 글을 한 곳에서 통합적으로 보여주기 어려움.

---

## 2. Architecture & Tech Stack (아키텍처 및 기술)
### 2.1 시스템 논리적 구조
본 프로젝트는 **Static Site Generation (SSG)** 방식을 채택하여, 빌드 시점에 모든 페이지를 정적 HTML로 생성합니다.

- **Content Layer**: 로컬 Markdown 파일 (`posts/*.md`) 및 GitHub API.
- **Application Layer**: Next.js App Router가 라우팅 및 페이지 렌더링 담당.
- **Presentation Layer**: React 컴포넌트와 Tailwind CSS로 UI 구성.
- **Deployment Layer**: GitHub Actions를 통해 GitHub Pages로 자동 배포.

### 2.2 기술 스택 선정 이유
| 구분           | 기술/도구                   | 선정 이유                                                                             |
| :------------- | :-------------------------- | :------------------------------------------------------------------------------------ |
| **Framework**  | **Next.js 15 (App Router)** | 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG)의 강력한 지원, 최신 React 기능 활용. |
| **Language**   | **TypeScript**              | 정적 타입 지정을 통한 코드 안정성 및 유지보수성 향상.                                 |
| **Styling**    | **Tailwind CSS**            | 유틸리티 퍼스트 접근 방식으로 빠른 UI 개발 및 일관된 디자인 시스템 구축.              |
| **UI Library** | **Shadcn UI**               | 재사용 가능한 고품질 컴포넌트 제공, 접근성(Accessibility) 보장.                       |
| **Content**    | **Markdown / Gray-matter**  | 개발자 친화적인 콘텐츠 작성 경험, 별도 DB 없이 파일 기반 관리.                        |
| **Deployment** | **GitHub Pages**            | 무료 호스팅, GitHub 저장소와의 완벽한 연동, CI/CD 파이프라인 구축 용이.               |

---

## 3. Key Features & Logic (핵심 기능 및 로직)
### 3.1 Markdown 기반 블로그 엔진
- **로직**: `lib/posts.ts`에서 파일 시스템(`fs`)을 통해 `posts/` 디렉토리의 `.md` 파일을 읽어옵니다.
- **메타데이터 파싱**: `gray-matter` 라이브러리를 사용하여 Frontmatter(제목, 날짜, 태그 등)를 추출하고 객체화합니다.
- **동적 라우팅**: `app/blog/[slug]/page.tsx`를 통해 URL 슬러그에 맞는 포스트를 렌더링합니다.

### 3.2 GitHub Projects 자동 연동
- **기능**: 사용자의 GitHub 계정(`JYS1025`)에 있는 Public Repository 목록을 자동으로 가져와 전시합니다.
- **구현**: GitHub REST API를 호출하여 저장소 이름, 설명, 토픽, 링크 등을 받아와 카드 UI로 변환합니다.

### 3.3 반응형 UI 및 다크 모드
- **UI**: 모바일, 태블릿, 데스크탑 등 다양한 해상도에 최적화된 레이아웃 제공.
- **테마**: `next-themes`를 활용하여 시스템 설정 또는 사용자 선택에 따른 라이트/다크 모드 전환 지원.

---

## 4. Issue Tracking & Troubleshooting (이슈 및 해결)
### 4.1 GitHub Pages 배포 시 README 노출 문제
- **상황**: 배포 후 사이트 접속 시 메인 페이지가 아닌 `README.md` 내용이 표시됨.
- **원인**: GitHub Pages 설정이 빌드된 결과물(`GitHub Actions`)이 아닌 소스 코드 브랜치(`Deploy from a branch`)를 바라보고 있었음.
- **해결**: Repository Settings > Pages > Source를 **GitHub Actions**로 변경하여 해결.

### 4.2 정적 내보내기(Static Export) 이미지 최적화 이슈
- **상황**: `npm run build` 시 이미지 최적화 관련 에러 발생.
- **원인**: Next.js의 기본 Image Optimization API는 Node.js 서버 런타임이 필요하므로, 정적 사이트 환경(GitHub Pages)에서는 작동하지 않음.
- **해결**: `next.config.ts`에 `images: { unoptimized: true }` 설정을 추가하여 해결.

### 4.3 남은 과제 (To-do)
- [ ] **SEO 최적화**: `sitemap.xml` 및 `robots.txt` 자동 생성 스크립트 추가.
- [ ] **댓글 시스템**: Giscus 등을 연동하여 방문자 피드백 기능 추가.
- [ ] **검색 기능**: 클라이언트 사이드 검색 또는 Algolia 연동.

---

## 5. Conclusion & Future Works (결론 및 향후 계획)
### 5.1 기대 효과
- **퍼스널 브랜딩 강화**: 기술 블로그와 포트폴리오를 통합하여 전문성 어필.
- **유지보수 효율성 증대**: 자동화된 배포 파이프라인과 파일 기반 콘텐츠 관리로 운영 비용 절감.

### 5.2 버전 2.0 업그레이드 계획
- **MDX 도입**: 마크다운 내에서 React 컴포넌트를 직접 사용하여 인터랙티브한 콘텐츠 제작 지원.
- **성능 최적화**: 이미지 포맷 차세대 변환(WebP) 및 코드 스플리팅 고도화.
