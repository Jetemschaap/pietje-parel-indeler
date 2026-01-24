"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Speler = { naam: string; foto: string };

function SpelerVak({ speler }: { speler: Speler }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 10,
          background: "#222",
          overflow: "hidden",
        }}
      >
        <img
          src={speler.foto}
          alt={speler.naam}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ marginTop: 6, fontWeight: 800, fontSize: 14 }}>
        {speler.naam}
      </div>
    </div>
  );
}

function BaanFullWidth({
  letter,
  spelers,
}: {
  letter: string;
  spelers: Speler[];
}) {
  const max5 = spelers.slice(0, 5);

  const boven = max5.slice(0, 2);
  const onder = max5.slice(2, 4);
  const extra = max5[4];

  const leeg: Speler = { naam: "", foto: "/leeg.png" };
  const b0 = boven[0] ?? leeg;
  const b1 = boven[1] ?? leeg;
  const o0 = onder[0] ?? leeg;
  const o1 = onder[1] ?? leeg;

  return (
    <section style={{ background: "#4f63ff", borderRadius: 18, padding: 16 }}>
      <div
        style={{
          textAlign: "center",
          fontSize: 34,
          fontWeight: 900,
          marginBottom: 12,
        }}
      >
        Baan {letter}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <SpelerVak speler={b0} />
        <SpelerVak speler={b1} />
      </div>

      <div
        style={{
          height: 4,
          background: "#fff",
          borderRadius: 2,
          margin: "14px 0",
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <SpelerVak speler={o0} />
        <SpelerVak speler={o1} />
      </div>

      {extra && (
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 160 }}>
            <SpelerVak speler={extra} />
          </div>
        </div>
      )}
    </section>
  );
}

function rotate<T>(arr: T[], offset: number) {
  if (arr.length === 0) return arr;
  const k = ((offset % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}
function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Per baan hoeveel spelers: normaal 4. Extra wordt 5, tekort wordt 3. 5/3 rouleert per uur. */
function computeTargetSizes(n: number, banen: string[], hourIndex: number) {
  const m = banen.length;
  const sizes = Array.from({ length: m }, () => 4);

  const baseTotal = 4 * m;
  let diff = n - baseTotal; // + => extra (5), - => tekort (3)

  let start = hourIndex % m;

  if (diff > 0) {
    while (diff > 0) {
      sizes[start] = Math.min(5, sizes[start] + 1);
      diff--;
      start = (start + 1) % m;
      if (sizes.every((s) => s === 5)) break;
    }
  } else if (diff < 0) {
    diff = -diff;
    while (diff > 0) {
      sizes[start] = Math.max(1, sizes[start] - 1);
      diff--;
      start = (start + 1) % m;
      if (sizes.every((s) => s === 1)) break;
    }
  }

  return sizes;
}

/**
 * 5/3-regel:
 * - Bepaal sizes per baan (4 normaal, soms 5 of 3).
 * - Iedereen die vorige uur "special" (op 5 of 3) stond, proberen we nu eerst in 4-banen te zetten.
 * - Bij 9 spelers (2 banen) móét er weer 1 baan van 5 zijn, maar wie die "extra" is rouleert.
 */
function assignWith53Rule(
  spelers: Speler[],
  banen: string[],
  prevSpecialNames: Set<string>,
  hourIndex: number
) {
  const n = spelers.length;

  const sizes = computeTargetSizes(n, banen, hourIndex);

  const normalLanes: string[] = [];
  const specialLanes: string[] = [];
  banen.forEach((b, idx) => {
    if (sizes[idx] === 4) normalLanes.push(b);
    else specialLanes.push(b);
  });

 // Optie A: volledig opnieuw husselen (elke keer echt nieuw)
const ordered = shuffle([...spelers]);

// splits: vorige special vs rest
let prevSpecial: Speler[] = [];
let others: Speler[] = [];
for (const s of ordered) {
  if (prevSpecialNames.has(s.naam)) prevSpecial.push(s);
  else others.push(s);
}

// beide groepen ook onderling husselen
prevSpecial = shuffle(prevSpecial);
others = shuffle(others);

  // extra roulatie zodat niet altijd dezelfde persoon de "5e" blijft
  prevSpecial = rotate(prevSpecial, hourIndex);
  others = rotate(others, hourIndex);

  const map: Record<string, Speler[]> = {};
  banen.forEach((b) => (map[b] = []));

  const fillLaneRoundRobin = (laneLetters: string[], pool: Speler[]) => {
    if (laneLetters.length === 0) return;
    let laneIdx = 0;

    while (pool.length > 0) {
      const lane = laneLetters[laneIdx];
      const target = sizes[banen.indexOf(lane)];
      if (map[lane].length < Math.min(5, target)) {
        map[lane].push(pool.shift()!);
      }
      laneIdx = (laneIdx + 1) % laneLetters.length;

      const allFull = laneLetters.every((l) => {
        const t = sizes[banen.indexOf(l)];
        return map[l].length >= Math.min(5, t);
      });
      if (allFull) break;
    }
  };

  // 1) vorige special eerst in normale 4-banen
  fillLaneRoundRobin(normalLanes, prevSpecial);

  // 2) normale banen vullen met rest
  fillLaneRoundRobin(normalLanes, others);

  // 3) special banen vullen met rest
  fillLaneRoundRobin(specialLanes, others);

  // 4) als er nog prevSpecial over is, moeten die toch ergens heen
  fillLaneRoundRobin(specialLanes, prevSpecial);

  // wie is dit uur "special"?
  const specialNow = new Set<string>();
  banen.forEach((b) => {
    const target = sizes[banen.indexOf(b)];
    if (target !== 4) {
      map[b].forEach((s) => specialNow.add(s.naam));
    }
  });

  return { map, specialNow };
}

export default function Banen() {
  const router = useRouter();

  const [spelers, setSpelers] = useState<Speler[]>([]);
  const [banen, setBanen] = useState<string[]>([]);
  const [baanMap, setBaanMap] = useState<Record<string, Speler[]>>({});
  const [hourIndex, setHourIndex] = useState<number>(0);

  const prevSpecialNames = useMemo(() => {
    const raw =
      typeof window !== "undefined"
        ? localStorage.getItem("pietje_prev_special")
        : null;
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  }, [hourIndex]);

  useEffect(() => {
    const spelersRaw = localStorage.getItem("pietje_spelers");
    const banenRaw = localStorage.getItem("pietje_banen");

    const s: Speler[] = spelersRaw ? JSON.parse(spelersRaw) : [];
    const b: string[] = banenRaw ? JSON.parse(banenRaw) : [];

    const letters = b.map((x) => x.toUpperCase());

    const hRaw = localStorage.getItem("pietje_hour");
    const h = hRaw ? Number(hRaw) : 0;

    setSpelers(s);
    setBanen(letters);
    setHourIndex(h);

    // eerste uur: prevSpecial leeg
    const { map, specialNow } = assignWith53Rule(
      s,
      letters,
      new Set<string>(),
      h
    );

    setBaanMap(map);
    localStorage.setItem(
      "pietje_prev_special",
      JSON.stringify(Array.from(specialNow))
    );
    localStorage.setItem("pietje_hour", String(h));
  }, []);

  function volgendUur() {
    if (banen.length === 0) return;

    const nextHour = hourIndex + 1;
    const { map, specialNow } = assignWith53Rule(
      spelers,
      banen,
      prevSpecialNames,
      nextHour
    );

    setBaanMap(map);
    setHourIndex(nextHour);

    localStorage.setItem(
      "pietje_prev_special",
      JSON.stringify(Array.from(specialNow))
    );
    localStorage.setItem("pietje_hour", String(nextHour));
  }

  return (
    <main
      style={{ minHeight: "100vh", background: "#000", color: "#fff", padding: 16 }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {banen.map((letter) => (
            <BaanFullWidth
              key={letter}
              letter={letter}
              spelers={baanMap[letter] || []}
            />
          ))}
        </div>

        <div style={{ maxWidth: 520, margin: "26px auto 0 auto" }}>
          <img
            src="/volgenduur.png"
            alt="Volgend uur"
            style={{ width: "100%", cursor: "pointer", marginBottom: 16 }}
            onClick={volgendUur}
          />

          <img
            src="/reset.png"
            alt="Reset"
            style={{ width: "100%", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        </div>
      </div>
    </main>
  );
}
