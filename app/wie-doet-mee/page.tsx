"use client";

import { useMemo, useState } from "react";

type Speler = {
  naam: string;
  bestand: string;
};

// BRONLIJST (namen + bestandsnamen)
const spelersBron: Speler[] = [
  { naam: "Ed Beijn", bestand: "edb.png" },
  { naam: "Jan Bonnema", bestand: "janb.png" },
  { naam: "Henny Gouw", bestand: "hennyg.png" },
  { naam: "Cees de Graaf", bestand: "ceesdg.png" },
  { naam: "Henk de Graaf", bestand: "henkdg.png" },
  { naam: "Cor Heijboer", bestand: "corh.png" },
  { naam: "Jan Hollemans", bestand: "tijdelijk.png" },
  { naam: "Ed Jonker", bestand: "edj.png" },
  { naam: "Arie Langstraat", bestand: "ariel.png" },
  { naam: "Piet van Loon", bestand: "pietvl.png" },
  { naam: "Cees Meeuwis", bestand: "ceesm.png" },
  { naam: "Huug Noordermeer", bestand: "huugn.png" },
  { naam: "Dick Nugteren", bestand: "dickn.png" },
  { naam: "John Schaap", bestand: "johns.png" },
  { naam: "Martin Schoenmakers", bestand: "martin.png" },
  { naam: "Pieter Slijkoord", bestand: "pieters.png" },
  { naam: "Wim Smit", bestand: "wims.png" },
  { naam: "Aad Tettero", bestand: "aadt.png" },
  { naam: "Cees van Tooren", bestand: "ceesvt.png" },
  { naam: "Johan van Zon", bestand: "johanvz.png" },
  { naam: "Gerard Klaui", bestand: "tijdelijk.png" },
  { naam: "Henny de Graaf", bestand: "hennydg.png" },
  { naam: "Leo Koster", bestand: "leo.png" },
  { naam: "Invaller 1", bestand: "tijdelijk.png" },
];

export default function WieDoetMee() {
  // 🎲 RANDOM 1 OF 2 (ÉÉN KEER PER PAGINA-LAAD)
  const actieveMap = useMemo(() => {
  const mappen = ["players", "players-net", "players-bobble"];
  return mappen[Math.floor(Math.random() * mappen.length)];
}, []);

  // selecties
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);
  const [banen, setBanen] = useState<string[]>([]);

  // echte spelerslijst met juiste map
  const spelers = useMemo(() => {
    return spelersBron.map((s) => ({
      naam: s.naam,
      foto: `/${actieveMap}/${s.bestand}`,
    }));
  }, [actieveMap]);

  function toggleSpeler(naam: string) {
    setGeselecteerd((prev) =>
      prev.includes(naam) ? prev.filter((n) => n !== naam) : [...prev, naam]
    );
  }

  function toggleBaan(letter: string) {
    setBanen((prev) =>
      prev.includes(letter) ? prev.filter((b) => b !== letter) : [...prev, letter]
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 20,
        backgroundColor: "#000",
        color: "#fff",
      }}
    >
      {/* SPELERS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12,
        }}
      >
        {spelers.map((s, i) => {
          const aan = geselecteerd.includes(s.naam);

          return (
            <div
              key={s.naam + "-" + i}
              onClick={() => toggleSpeler(s.naam)}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                cursor: "pointer",
                textAlign: "center",
                border: aan ? "4px solid #facc15" : "4px solid transparent",
                opacity: aan ? 1 : 0.35,
              }}
            >
              <img
                src={s.foto}
                alt={s.naam}
                style={{
                  width: "100%",
                  height: 140,
                  objectFit: "cover",
                  background: "#333",
                }}
              />
              <div style={{ padding: 8, fontWeight: 800 }}>{s.naam}</div>
            </div>
          );
        })}
      </div>

      {/* BANEN */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {["a", "b", "c", "d"].map((letter) => (
          <img
            key={letter}
            src={`/banen/knop${letter}.png`}
            alt={`Baan ${letter.toUpperCase()}`}
            onClick={() => toggleBaan(letter)}
            style={{
              width: 80,
              cursor: "pointer",
              opacity: banen.includes(letter) ? 1 : 0.35,
            }}
          />
        ))}
      </div>

      {/* INDELEN */}
      <div style={{ marginTop: 10 }}>
        <img
          src="/indelen.png"
          alt="Indelen"
          style={{
            width: "100%",
            maxWidth: 366,
            display: "block",
            margin: "0 auto",
            cursor: "pointer",
            opacity: banen.length === 0 ? 0.4 : 1,
          }}
          onClick={() => {
            const gekozenSpelers = spelers.filter((s) =>
              geselecteerd.includes(s.naam)
            );

            localStorage.setItem(
              "pietje_spelers",
              JSON.stringify(gekozenSpelers)
            );
            localStorage.setItem("pietje_banen", JSON.stringify(banen));

            window.location.href = "/banen";
          }}
        />
      </div>
    </main>
  );
}
