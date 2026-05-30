# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: capture_ngajiin.spec.ts >> capture ngajiin screenshot
- Location: tests\e2e\capture_ngajiin.spec.ts:4:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "https://ngajiin.web.id/", waiting until "networkidle"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e4]:
      - link "Ngajiin.id Logo" [ref=e7] [cursor=pointer]:
        - /url: /
        - img "Ngajiin.id Logo" [ref=e8]
      - generic [ref=e10]:
        - link "Beranda" [ref=e11] [cursor=pointer]:
          - /url: /#beranda
          - text: Beranda
        - link "Program" [ref=e12] [cursor=pointer]:
          - /url: /#program
          - text: Program
        - link "Pengajar" [ref=e13] [cursor=pointer]:
          - /url: /#pengajar
          - text: Pengajar
        - link "Artikel" [ref=e14] [cursor=pointer]:
          - /url: /artikel
          - text: Artikel
        - link "Rekaman Kajian" [ref=e15] [cursor=pointer]:
          - /url: /#rekaman
          - text: Rekaman Kajian
        - link "Daftar Sekarang" [ref=e16] [cursor=pointer]:
          - /url: https://wa.me/+6281334225986/?text=Assalamu%27alaikum%20wr.%20wb.%0ASaya%20ingin%20menjadi%20peserta%20di%20Ngajiin.id.
  - main [ref=e18]:
    - img "Hero Background" [ref=e20]
    - generic [ref=e24]:
      - heading "Kursus dan Mengaji Online" [level=1] [ref=e25]
      - paragraph [ref=e26]: Ngajiin.id merupakan platform belajar secara daring. Dengan menjadikan kitab-kitab turath sebagai rujukan dan kajian utama. Kami juga menyusun diktat untuk beberapa materi seperti pembelajaran ilmu mantik, bahasa Arab, ilmu Al-Quran, dan ilmu alat lainnya untuk memudahkan para peserta dalam memahami dasar-dasar keilmuan Islam.
      - generic [ref=e27]:
        - link "Daftar Sekarang" [ref=e28] [cursor=pointer]:
          - /url: https://wa.me/+6281334225986/?text=Assalamu%27alaikum%20wr.%20wb.%0ASaya%20ingin%20menjadi%20peserta%20di%20Ngajiin.id.
        - link "Lihat Program →" [ref=e29] [cursor=pointer]:
          - /url: "#program"
  - generic [ref=e34]:
    - generic [ref=e35]:
      - heading "Program yang Tersedia" [level=2] [ref=e36]
      - paragraph [ref=e37]: Pilih Program Terbaik Anda
    - generic [ref=e41]:
      - generic [ref=e42]:
        - img "Kursus Online" [ref=e44]
        - generic [ref=e45]:
          - generic [ref=e46]:
            - paragraph [ref=e47]: Kursus Online
            - paragraph [ref=e48]: Belajar Disiplin Ilmu Islam Secara Privat dan Intensif
          - generic [ref=e49]:
            - text: Pelajari Selengkapnya
            - img [ref=e50]
      - generic [ref=e52]:
        - img "Kajian & Bimbingan Islam" [ref=e54]
        - generic [ref=e55]:
          - generic [ref=e56]:
            - paragraph [ref=e57]: Kajian & Bimbingan Islam
            - paragraph [ref=e58]: Memahami Islam Secara Komperhensif dan Utuh
          - generic [ref=e59]:
            - text: Pelajari Selengkapnya
            - img [ref=e60]
      - generic [ref=e62]:
        - img "Bimbingan Pra-nikah" [ref=e64]
        - generic [ref=e65]:
          - generic [ref=e66]:
            - paragraph [ref=e67]: Bimbingan Pra-nikah
            - paragraph [ref=e68]: Tips & Trik Membangun Keluarga Sakinah, Mawadah dan Rahmah
          - generic [ref=e69]:
            - text: Pelajari Selengkapnya
            - img [ref=e70]
  - generic [ref=e74]:
    - generic [ref=e75]:
      - heading "Kurikulum" [level=2] [ref=e76]
      - paragraph [ref=e77]: Materi Pembelajaran
    - generic [ref=e80]:
      - generic [ref=e82]:
        - heading "Fikih" [level=3] [ref=e83]: Fikih
        - list [ref=e86]:
          - listitem [ref=e87]:
            - img [ref=e89]
            - paragraph [ref=e91]: "Pemula: Kitab Safinatunnajah"
          - listitem [ref=e92]:
            - img [ref=e94]
            - paragraph [ref=e96]: "Mampu: Kitab Fathu al-Qarib"
          - listitem [ref=e97]:
            - img [ref=e99]
            - paragraph [ref=e101]: "Cakap: Kitab Minhaj al-Talibin"
      - generic [ref=e103]:
        - heading "Aqidah" [level=3] [ref=e104]: Aqidah
        - list [ref=e107]:
          - listitem [ref=e108]:
            - img [ref=e110]
            - paragraph [ref=e112]: "Pemula: Kitab Aqidat al-Awam"
          - listitem [ref=e113]:
            - img [ref=e115]
            - paragraph [ref=e117]: "Mampu: Kitab Maqalat al-Islamiyyin"
          - listitem [ref=e118]:
            - img [ref=e120]
            - paragraph [ref=e122]: "Cakap: Kitab Al-qawl al-Sadid"
      - generic [ref=e124]:
        - heading "Tajwid" [level=3] [ref=e125]: Tajwid
        - paragraph [ref=e129]: Program tajwid tersedia dalam bentuk rekaman eksklusif.
  - generic [ref=e132]:
    - generic [ref=e133]:
      - heading "Pengajar" [level=2] [ref=e134]
      - paragraph [ref=e135]: Belajar Langsung dari Ahlinya
    - generic [ref=e138]:
      - generic [ref=e140]:
        - img "Ustadz Achmad Syauqi Hifni, Lc., M.Ag" [ref=e142]
        - generic [ref=e143]:
          - heading "Ustadz Achmad Syauqi Hifni, Lc., M.Ag" [level=3] [ref=e144]
          - paragraph [ref=e145]: Seorang alumni Universitas Al-Azhar Mesir yang mendapatkan beasiswa penuh dari pemerintah Mesir.
          - link "Hubungi via WhatsApp" [ref=e146] [cursor=pointer]:
            - /url: https://wa.me/6281334225986
            - text: Hubungi via WhatsApp
            - img [ref=e147]
      - generic [ref=e150]:
        - img "Ahmad Faaza Hudzaifah, M.A." [ref=e152]
        - generic [ref=e153]:
          - heading "Ahmad Faaza Hudzaifah, M.A." [level=3] [ref=e154]
          - paragraph [ref=e155]: Alumni UIN Sunan Kalijaga Yogyakarta dan penghafal Al-Qur’an. Beliau mendalami kajian Al-Qur’an, tafsir, serta fiqh.
          - link "Hubungi via WhatsApp" [ref=e156] [cursor=pointer]:
            - /url: https://wa.me/6281334225986
            - text: Hubungi via WhatsApp
            - img [ref=e157]
  - generic [ref=e161]:
    - generic [ref=e162]:
      - heading "Rekaman" [level=2] [ref=e163]
      - paragraph [ref=e164]: Akses Kajian Kapan Saja
      - paragraph [ref=e167]: Tidak sempat mengikuti kelas langsung? Kami menyediakan rekaman kajian eksklusif yang bisa Anda akses kapan saja.
    - generic [ref=e168]:
      - generic [ref=e170]:
        - img [ref=e172]
        - generic [ref=e174]: Fikih
      - generic [ref=e176]:
        - img [ref=e178]
        - generic [ref=e180]: Aqidah
      - generic [ref=e182]:
        - img [ref=e184]
        - generic [ref=e186]: Tajwid
    - link "Akses Sekarang" [ref=e188] [cursor=pointer]:
      - /url: https://wa.me/+6281334225986/?text=Assalamu%27alaikum%20wr.%20wb.%0ASaya%20ingin%20mengakses%20rekaman%20kajian%20di%20Ngajiin.id.
  - generic [ref=e194]:
    - generic [ref=e195]:
      - heading "Filosofi Kami" [level=2] [ref=e196]
      - paragraph [ref=e197]: Visi & Misi Ngajiin.id
    - generic [ref=e200]:
      - generic [ref=e201]:
        - img [ref=e204]
        - heading "Visi" [level=3] [ref=e207]
        - paragraph [ref=e208]: "\"Mencerdaskan kehidupan bangsa dengan membangun masyarakat yang moderat, inklusif, luwes, serta senantiasa menjunjung tinggi nilai-nilai kebaikan.\""
      - generic [ref=e209]:
        - img [ref=e212]
        - heading "Misi" [level=3] [ref=e214]
        - list [ref=e215]:
          - listitem [ref=e216]:
            - img [ref=e218]
            - generic [ref=e220]: Mengembangkan proses pembelajaran yang mendorong berpikir kritis, kreatif, dan berakhlak.
          - listitem [ref=e221]:
            - img [ref=e223]
            - generic [ref=e225]: Membentuk karakter masyarakat yang moderat, seimbang, dan bertanggung jawab.
          - listitem [ref=e226]:
            - img [ref=e228]
            - generic [ref=e230]: Menumbuhkan semangat dialog, kerja sama, dan persatuan dalam keberagaman.
          - listitem [ref=e231]:
            - img [ref=e233]
            - generic [ref=e235]: Menyediakan pendidikan agama yang dapat diakses di mana pun dan terjangkau.
  - contentinfo [ref=e236]:
    - generic [ref=e238]:
      - generic [ref=e239]:
        - generic [ref=e240]:
          - link "Ngajiin.id" [ref=e241] [cursor=pointer]:
            - /url: /
            - generic [ref=e242]: Ngajiin.id
          - paragraph [ref=e243]: Mencerdaskan kehidupan bangsa dengan membangun masyarakat yang moderat, inklusif, luwes, serta senantiasa menjunjung tinggi nilai-nilai kebaikan.
        - generic [ref=e244]:
          - generic [ref=e245]:
            - heading "Program" [level=3] [ref=e246]
            - list [ref=e247]:
              - listitem [ref=e248]:
                - link "Bahasa Arab" [ref=e249] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e250]:
                - link "Ilmu Mantik" [ref=e251] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e252]:
                - link "Ilmu Al-Quran" [ref=e253] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e254]:
                - link "Ilmu Alat" [ref=e255] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e256]:
            - heading "Legal" [level=3] [ref=e257]
            - list [ref=e258]:
              - listitem [ref=e259]:
                - link "Privacy Policy" [ref=e260] [cursor=pointer]:
                  - /url: "#"
              - listitem [ref=e261]:
                - link "Terms of Service" [ref=e262] [cursor=pointer]:
                  - /url: "#"
          - generic [ref=e263]:
            - heading "Hubungi Kami" [level=3] [ref=e264]
            - list [ref=e265]:
              - listitem [ref=e266]:
                - link "Kantorpesantren4@gmail.com" [ref=e267] [cursor=pointer]:
                  - /url: mailto:Kantorpesantren4@gmail.com
      - generic [ref=e269]:
        - paragraph [ref=e270]: © 2026 Ngajiin.id
        - paragraph [ref=e272]:
          - text: Developed by
          - link "Farros" [ref=e273] [cursor=pointer]:
            - /url: https://farros.co
```

# Test source

```ts
  1  | import { test } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | test('capture ngajiin screenshot', async ({ page }) => {
  5  |   await page.setViewportSize({ width: 1280, height: 720 });
> 6  |   await page.goto('https://ngajiin.web.id', { waitUntil: 'networkidle' });
     |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  7  |   await page.waitForTimeout(2000);
  8  |   const screenshotPath = path.join(process.cwd(), 'public/projects/ngajiin-web-id.png');
  9  |   await page.screenshot({ path: screenshotPath });
  10 |   console.log('Screenshot saved to:', screenshotPath);
  11 | });
  12 | 
```