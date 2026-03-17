import { mkdir, writeFile } from "node:fs/promises"

const assets = [
  [
    "logo.jpg",
    "https://instagram.fpnq7-6.fna.fbcdn.net/v/t51.2885-19/348340409_991234888547999_7401555192025281650_n.jpg?stp=dst-jpg_s320x320_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=instagram.fpnq7-6.fna.fbcdn.net&_nc_cat=111&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=m2H4kyYxn_wQ7kNvwHQziyS&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Afyp6wvBlnAI-0FG9eu85Pi52-__G99E2-jIDNYy7VFZxA&oe=69BF15D3&_nc_sid=8b3546",
  ],
  [
    "video-1.jpg",
    "https://instagram.fpnq7-2.fna.fbcdn.net/v/t51.82787-15/651786212_18352326208230656_8589688515231439991_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fpnq7-2.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=CFFTJOciyHoQ7kNvwFve-r4&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfxPuioQ8TflPSajB3H3_RDZiN-P1SyHo6kejC8MNqaFIg&oe=69BF0321&_nc_sid=8b3546",
  ],
  [
    "video-2.jpg",
    "https://instagram.fpnq7-7.fna.fbcdn.net/v/t51.82787-15/639595560_18449237521101786_1854612026614019347_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fpnq7-7.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=OquKSqtGYsAQ7kNvwH04D-t&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfyH35crDpQor1g8Zr6FxmfqrRiLYdavOC1_O5TwniCihw&oe=69BF05E4&_nc_sid=8b3546",
  ],
  [
    "video-3.jpg",
    "https://instagram.fpnq7-6.fna.fbcdn.net/v/t51.82787-15/642490741_18453607417099432_6448323574586395402_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fpnq7-6.fna.fbcdn.net&_nc_cat=104&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=x-CGYp_ITd4Q7kNvwHVUS9f&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_Afy-kOuTWtarxrV_CCzMxdHlYubCt40txan196RaiLCwvA&oe=69BEEF74&_nc_sid=8b3546",
  ],
  [
    "post-1.jpg",
    "https://instagram.fpnq7-4.fna.fbcdn.net/v/t39.30808-6/468639499_18473382697013446_3783128276142692717_n.jpg?stp=dst-jpg_e35_p1080x1080_sh0.08_tt6&_nc_ht=instagram.fpnq7-4.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=ru4c_8KpvfYQ7kNvwHwF-WJ&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wAAAAA&ccb=7-5&oh=00_AfwDOIRLbDKLOmfCIRpzw-N4ysd2BN802q9qkN8kKh-abw&oe=69BF187A&_nc_sid=8b3546",
  ],
  [
    "post-2.jpg",
    "https://instagram.fpnq7-4.fna.fbcdn.net/v/t51.29350-15/351799325_9292145677523698_6042984453446116149_n.jpg?stp=dst-jpg_e35_s1080x1080_tt6&_nc_ht=instagram.fpnq7-4.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=6EL3pRvQBSgQ7kNvwFG_EHd&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfwwbUZDU3O-IMFyp7zE0sz6gT9VXYh1gbsQw_8M3p_7_w&oe=69BEF9E2&_nc_sid=8b3546",
  ],
  [
    "post-3.jpg",
    "https://instagram.fpnq7-4.fna.fbcdn.net/v/t51.82787-15/629064059_18567500209013446_9215186971858919667_n.jpg?stp=dst-jpg_e35_s1080x1080_sh0.08_tt6&_nc_ht=instagram.fpnq7-4.fna.fbcdn.net&_nc_cat=110&_nc_oc=Q6cZ2QFpU9Ojgonn_AE7zmMty342xHNVaAVEQ_7qF29sybVXwFPy8gPQEDHqxGmoW260nxktApYEtpQSh2BgAct6Nhno&_nc_ohc=YvKuEytBWG8Q7kNvwGjsNt9&_nc_gid=Dvdh6n2_dF-JeTnZfhIjzQ&edm=AOQ1c0wBAAAA&ccb=7-5&oh=00_AfyNkBs6ZEbMNXisQroWR0ms2i7to0f7FGKFWuPGu4Jy5A&oe=69BEFB55&_nc_sid=8b3546",
  ],
]

async function run() {
  await mkdir("public/images/instagram", { recursive: true })

  for (const [fileName, url] of assets) {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://www.instagram.com/",
      },
    })

    if (!res.ok) {
      throw new Error(`Failed ${fileName}: ${res.status}`)
    }

    const bytes = Buffer.from(await res.arrayBuffer())
    await writeFile(`public/images/instagram/${fileName}`, bytes)
    console.log(`saved ${fileName} (${bytes.length} bytes)`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
