# SimpleLog - 목회자 & 개발자 블로그

Astro 기반의 미니멀리스트 블로그 프로젝트입니다.


## GitHub Pages 배포 방법

1. GitHub에서 새로운 저장소(이름: `SimpleLog`)를 만듭니다.
2. 로컬 프로젝트에서 Git을 초기화하고 연결합니다:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for SimpleLog"
   git branch -M main
   git remote add origin https://github.com/<your-username>/SimpleLog.git
   git push -u origin main
   ```
3. `astro.config.mjs` 파일에서 `site`와 `base` 값을 자신의 계정과 저장소 이름에 맞게 수정합니다.
4. GitHub 저장소 설정(`Settings > Pages`)에서 `Source`를 **GitHub Actions**로 변경합니다.
5. 이제 코드를 `push`할 때마다 자동으로 배포가 진행됩니다.
