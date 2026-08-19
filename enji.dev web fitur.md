---
title: Fitur Multiple Reactions
description: Bikin fitur multiple reactions 👏😲🧐 di Next.js (MongoDB, Prisma, SWR)
date: '2023-01-15'
lang: id
tags:
  - features
  - concept
category: features
---

import IH from '@/components/mdx/InlineHighlight';
import Reactions from '@/components/Reactions';

[TL;DR](#hasil-akhir)

Engga nyangka bikin ini doang bisa sampe hampir tiga hari loh, tapi emang semuanya dari 0 sih. **CUMA** bikin fitur reactions aja, iya itu yang ngikut-ngikut di bawah 😁

Engga bikin **analisisnya** dulu, gas langsung bikin database, trial & error dan refactoring. Antara gabisa sama males, tapi yang jelas pengen langsung ngoding sih 😂

Sekalian di artikel ini saya jabarin deh, fiturnya apa aja, gimana konsep bikinnya, tapi bukan tutorial step by step ya.

Siapa tau kalian ada yang mau bikin juga ya kan, jadi bisa nyontek lah sedikit-sedikit mah, tapi ambil yang **'baiknya'** aja we ya.

Gasss langsung lah...

---

## Fitur

Pertama saya mikirin gambaran kasarnya dulu mau dibikin kaya gimana si reactions ini teh.

Dan dapetlah, kira-kira fiturnya kaya gini:

- **Multiple Reactions**

  Ada <IH>claps</IH>, <IH color="blue">wow</IH> dsb. dan sebisa mungkin gampang kalau misal kedepannya mau nambahin reaction yang lain.

  <br />

- **Batch Reactions**

  Bisa ngasih beberapa kali reaction yang sejenis, misal 20x <IH>claps</IH>, 10x <IH color="blue">wow</IH> dsb.

  <br />

- **Section Reactions**

  Bisa tau dimana user ngasih reaction, misal ngasih 10x <IH>claps</IH> di section yang judulnya **'Fitur'** kaya section ini.

  <br />

---

## Konsep

Jadi sebenarnya yang lama tuh bikin REST API, banyak refactoring, lama bikin skema databasenya dan lain-lain yang ke arah BE nya sih.

Pasti banyak yang kurang tepat, harap dimaklum ya, bukan anak BE soalnya ✌

### Database

Jujur setelah tiga tahun gitu saya baru berurusan lagi sama database. Terakhir ngurusin database teh pas bikin aplikasi ujian akhir perkuliahan.

Pertama nentuin dulu mau hosting dimana nih. Masalah SQL noSQL ngga masalah, karena masih coba-coba, jadi nyoba cari yang gratisan wkwk dan dapet hostingan **MongoDB Atlas** yang shared, lumayan lah.

Karena ORM nya juga saya pake **prisma**, jadi kayanya ngga terlalu ribet sih kalau migrasi ke database yang lain.

Mari ke skema database. Ini fokus ke fitur reactionsnya aja ya, sebenarnya ada field buat views dan shares tapi sengaja ngga saya masukin.

Pertama, saya bikin table **ContentMeta**. Ini buat nyimpen data postingannya.

Gaperlu nyimpen title, date, konten dll karena emang data postingannya langsung build secara lokal dari mdx, jadi cuma nyimpen slugnya aja.

```scheme {4}
model ContentMeta {
  id          String

  slug        String
  createdAt   DateTime
}
```

Kemudian ini nih yang penting, table **Reaction**, buat nyimpen si **reactions**nya.

```scheme {4-7}
model Reaction {
  id          String

  type        ReactionType
  section     String
  count       Int
  sessionId   String
  createdAt   DateTime

  contentId   String
}

enum ReactionType {
  CLAPPING
  THINKING
  AMAZED
}
```

Let's break it down slowly:

- `type`

  Penting banget, karena pake multiple reaction, `type` ini wajib pake. Tipe datanya saya pake predefined enum `ReactionType`, jadi nanti isinya cuma bisa antara `CLAPPING`, `THINKING`, dan `AMAZED`.

  Kalau mau nambahin reaction yang lain, bisa nambahin item baru ke enumnya. Opsi lain sekalian gasin aja ubah tipe datanya jadi String, jadi misal kalau mau pake reaction semua emoji juga bisa.

  > Kenapa ngga bikin relasi ke table baru aja?

  Bisa, cuma saya mikir kayanya bakal ribet ah nanti querynya, pake enum juga kayanya udah cukup, sekalian ngandelin type safetynya juga sih ✌

  <br />

- `section`

  Cuma nyimpen judul section yang active saat user klik reaction nya. Misal pas user baca yang judulnya 'Database', maka section ini nanti isinya 'database'.

  Cuma ngandelin [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), observe semua judul section yang ada, yang terakhir '**isIntersecting**' itu dijadikan nilai section ini.

  <br />

- `count`

  Ini buat jumlah batch reactionnya. Jadi pas ngeklik reaction tuh sebenarnya ngga langsung kirim ke API, tapi delay dulu sekian milliseconds, [debounce](https://www.freecodecamp.org/news/javascript-debounce-example/) lah.

  Sederhananya gini: pas klik reaction beberapa kali dalam selang waktu singkat tuh dikumpulin dulu jumlah kliknya (misal 10 klik), beres itu langsung kirim ke API, dan jumlah kliknya simpen di `count` ini.

  Buat saya cara ini lebih make sense, ketimbang request ke API 10x dan bikin 10 row reaction dengan data yang sama. Sekalian buat hemat storage databasenya.

  <br />

- `sessionId`

  Buat nyimpen 'siapa' yang ngereaction. Bukan nama atau identitas user sih, tapi saya pake ip address user.

  Eits, ngga mentah simpen ip addressnya juga, karena ini kan termasuk data yang sangat sensitif ya buat user.

  Saya hash tuh ip address, plus '**digaremin**' juga biar mantepp hehe. Jadi ngga ada yang tau tuh ip address user, termasuk saya yang bikin.

  Kira-kira kodenya gini:

  ```ts
  export const getSessionId = (req: NextApiRequest) => {
    const ipAddress = req.headers['x-forwarded-for'] || 'localhost';

    // hashes the user's IP address and combines it with
    // a salt to create a unique session ID that preserves
    // the user's privacy by obscuring their IP address.
    const currentSessionId = createHash('md5')
      .update(ipAddress + process.env.SALT_IP_ADDRESS, 'utf-8')
      .digest('hex');

    return currentSessionId;
  };
  ```

  Atau kalau mau inspect langsung juga gasss [kesini](https://github.com/enjidev/enji.dev/blob/425e3c09c906c005a7e1d9efbf21b87906ffd443/apps/enji.dev/src/helpers/server.ts).

  > Terus kenapa harus ada sessionId?

  Ini digunain buat 'limit' atau ngebatesin jumlah reactionsnya. Saya groupBy `type` where `sessionId`, terus `count` nya dikalkulasi.

  Kalau hasilnya udah nyentuh max limit, berarti user gabisa ngasih reaction lagi.

  <br />

---

### REST API

Ini sih cuma butuh satu endpoint, saya bikinnya `/reactions` terus cuma bisa nerima method POST gitu. Nerima datanya `slug`, `type`, `section`, dan `count`.

Seperti yang udah dijelasin sebelumnya, semua data yang dikirim dihandle di Front-End. Kecuali yang `sessionId`. `sessionId` ini digenerate pas request API nya.

Eh ada deng tambahin satu endpoint lagi, GET `/content`. Ini nampilin detail jumlah reactions `slug` saat ini, buat digunain di komponennya nanti.

Dari dua table sebelumnya, bisa dapet data ini (response `/content`):

```JSON
{
  "meta": {
    "reactionsDetail": {
      "CLAPPING": 65,
      "THINKING": 45,
      "AMAZED": 48
    }
  },
  "metaUser": {
    "reactionsDetail": {
      "CLAPPING": 15,
      "THINKING": 15,
      "AMAZED": 15
    }
  },
  "metaSection": {
    "fitur": {
      "reactionsDetail": {
        "CLAPPING": 0,
        "THINKING": 4,
        "AMAZED": 0
      }
    },
    "database": {
      "reactionsDetail": {
        "CLAPPING": 0,
        "THINKING": 0,
        "AMAZED": 6
      }
    },
  }
}
```

`meta` itu jumlah keseluruhan reactions dari semua user, `metaUser` jumlah reactions user saat ini, dan `metaSection` jumlah reactions pada section tertentu.

Mungkin ada yang ngeuh, itu `metaSection`nya kenapa ngga dibikin array aja?

Jujurr.... gatau juga sih 😂

Tapi karena di FE logic component saya cuma ngambil data per section (ngga looping), saya lebih suka ngambil datanya dengan cara `metaSection[section]` ketimbang array yang harus difilter dulu 👀

---

### Component

**This is the part that I enjoy the most.**

Pertama, untuk ngambil data dari API, saya pake SWR. Dikutip dari situs SWR nya sendiri:

> With SWR, components will get a stream of data updates constantly and automatically. And the UI will be always fast and reactive.

Enak banget sih pake SWR ini, apalagi mutation datanya.

---

Sekarang bikin komponen reactionsnya 🥳

Detail komponen:

1. Nampilin reaction yang mengekspresikan `claps`, `wow`, dan `hmm`.
2. Nampilin animasi emoji pas hover.
3. Munculin animasi pas batch klik atau klik beberapa kali.
4. Nambahin animasi ke reactions counternya.
5. Ganti emoji pas udah kena limit.

Untuk animasi emojinya (point 2) saya ambil [disini](https://animated-fluent-emoji.vercel.app/) ya.

---

Untuk urusan animasi masih setia pake framer motion 😍

Pas user klik reaction, kan muncul animasi tuh, pas event `onClick` cuma push yang nilai animasi `x` sama `y`-nya random. Nilai animasi tadi dirender jadi componentnya framer motion.

Dengan nilai `x` dan `y` yang random, jadi pas klik beberapa kali tuh ngga monoton animasinya ke arah situ-situ aja.

Bingung ya? hehe maaf, coba cek [full kodenya](https://github.com/enjidev/enji.dev/blob/425e3c09c906c005a7e1d9efbf21b87906ffd443/apps/enji.dev/src/components/EmojiReaction.tsx).

---

## Hasil Akhir

Ini dia hasil akhirnya, coba kasih reactions, sampe limit, ada animasinya tuh 😁

<div
  style={{
    maxWidth: '360px',
    margin: 'auto',
    marginTop: '32px',
    marginBottom: '32px',
  }}
>
  <Reactions withCountView={false} />
</div>

Meskipun masih butuh banyak penyesuaian baik dari styles, gambar, layout ataupun performance, tapi saya senang dengan hasil akhir saat ini.

---

## Summary

Meskipun pembuatan fitur ini cukup challenging terutama di BE nya, but I quite enjoy all the process. Meskipun butuh hampir tiga hari cuy 😁

Rekap tech stacks / librari yang digunakan:

- [MongoDB Atlas](https://www.mongodb.com/pricing) untuk database hosting.
- [Prisma](https://www.prisma.io/) untuk ORM nya.
- [SWR](https://swr.vercel.app/) untuk ngambil data dari API.
- [Framer Motion](https://www.framer.com/motion/) untuk animasi.
- [Animated Fluent Emoji](https://animated-fluent-emoji.vercel.app/)

---

> WAITTT, terus itu **section reactions**? API nya kan udah nyediain `metaSection`, dipake buat apa?

Kalau datanya udah ada aman lah ya, meskipun implementasinya emang belum. Tapi emang udah ada rencana dan kebayang mau dipake kaya gimana. Tunggu aja lah ya 😁

Tapi kayanya bakal update di [Twitter](https://twitter.com/enjidev), ngga bakal dibikinin postingan khusus.

**HATUR NUHUN** udah baca sampe selesai. Sampai jumpa minggu depan di postingan selanjutnya 👋



# Terus ada Fitur Ini
apps/enji.dev/src/components/InsightButton.tsx
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { m } from 'framer-motion';

import { InsightIcon } from '@/components/Icons';

import { formatNumber } from '@/helpers/post';

const animation = {
  hide: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

interface InsightButtonProps {
  views: number;
  shares: number;
  reactions: number;
}

function InsightButton({ views, shares, reactions }: InsightButtonProps) {
  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            title="Insight"
            aria-label="Insight"
            className={clsx(
              'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
              'hover:bg-slate-200 hover:dark:bg-[#1d263a]',
              [open && ['bg-slate-200', 'dark:bg-[#1d263a]']]
            )}
          >
            <InsightIcon className={clsx('h-5 w-5')} />
          </Popover.Button>
          {open && (
            <Popover.Panel
              static
              as={m.div}
              variants={animation}
              initial="hide"
              animate="show"
              className={clsx(
                'border-divider-light absolute inset-x-2 bottom-24 z-[902] flex flex-col overflow-hidden rounded-2xl border bg-white/70 pb-2 pt-1 backdrop-blur',
                'dark:border-divider-dark dark:bg-slate-900/80'
              )}
            >
              <div
                className={clsx(
                  'px-4 py-3 text-center text-[13px] text-lg font-bold'
                )}
              >
                Insight
              </div>
              <div className={clsx('flex justify-evenly py-2 text-sm')}>
                <div className={clsx('flex flex-col items-center gap-1')}>
                  <div>Views</div>
                  <div className={clsx('font-mono text-xl')}>
                    {formatNumber(views)}
                  </div>
                </div>
                <div className={clsx('flex flex-col items-center gap-1')}>
                  <div>Shares</div>
                  <div className={clsx('font-mono text-xl')}>
                    {formatNumber(shares)}
                  </div>
                </div>
                <div className={clsx('flex flex-col items-center gap-1')}>
                  <div>Reactions</div>
                  <div className={clsx('font-mono text-xl')}>
                    {formatNumber(reactions)}
                  </div>
                </div>
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
}

export default InsightButton;

<!-- apps/enji.dev/src/hooks/useInsight.ts -->
import { ContentType, ReactionType, ShareType } from '@prisma/client';
import merge from 'lodash/merge';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

import fetcher from '@/utils/fetcher';
import { postReaction, postShare, postView } from '@/helpers/api';

import type { TContentMetaDetail } from '@/types';

const INITIAL_VALUE: TContentMetaDetail = {
  meta: {
    views: 0,
    shares: 0,
    reactions: 0,
    reactionsDetail: {
      CLAPPING: 0,
      THINKING: 0,
      AMAZED: 0,
    },
  },
  metaUser: {
    reactionsDetail: {
      CLAPPING: 0,
      THINKING: 0,
      AMAZED: 0,
    },
  },
  metaSection: {},
};

export default function useInsight({
  slug,
  contentType,
  contentTitle,
  countView = true,
}: {
  slug: string;
  contentType: ContentType;
  contentTitle: string;
  countView?: boolean;
}) {
  // #region handle for batch click
  const timer = useRef<Record<ReactionType, NodeJS.Timeout>>({
    CLAPPING: null,
    THINKING: null,
    AMAZED: null,
  });
  const count = useRef<Record<ReactionType, number>>({
    CLAPPING: 0,
    THINKING: 0,
    AMAZED: 0,
  });
  // #endregion

  const { isLoading, data, mutate } = useSWR<TContentMetaDetail>(
    `/api/content/${slug}`,
    fetcher,
    {
      fallbackData: INITIAL_VALUE,
    }
  );

  // post view count
  useEffect(() => {
    if (countView) {
      postView({ slug, contentType, contentTitle });
    }
  }, [slug, contentType, contentTitle, countView]);

  const addShare = ({ type }: { type: ShareType }) => {
    // optimistic update
    mutate(
      merge({}, data, {
        meta: {
          shares: data.meta.shares + 1,
        },
      }),
      false
    );

    postShare({
      slug,
      contentType,
      contentTitle,
      type,
    });
  };

  const addReaction = ({
    type,
    section = undefined,
  }: {
    type: ReactionType;
    section?: string;
  }) => {
    // optimistic update
    mutate(
      merge({}, data, {
        meta: {
          reactions: data.meta.reactions + 1,
          reactionsDetail: {
            [type]: data.meta.reactionsDetail[type] + 1,
          },
        },
        metaUser: {
          reactionsDetail: {
            [type]: data.metaUser.reactionsDetail[type] + 1,
          },
        },
      }),
      false
    );

    // increment the current batch click count
    count.current[type] += 1;

    // debounce the batch click for sending the reaction data
    clearTimeout(timer.current[type]);
    timer.current[type] = setTimeout(() => {
      postReaction({
        slug,
        contentType,
        contentTitle,
        type,
        count: count.current[type],
        section,
      }).finally(() => {
        // reset the batch click count to zero for the next batch
        count.current[type] = 0;
      });
    }, 500);
  };

  return {
    isLoading,
    data,
    addShare,
    addReaction,
  };
}