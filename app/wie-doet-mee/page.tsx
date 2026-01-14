"use client";

import { useState } from "react";

type Speler = {
  naam: string;
  foto: string;
};

const spelers: Speler[] = [
  { naam: "Ed Beijn", foto: "/players/edb.png" },
  { naam: "Jan Bonnema", foto: "/players/janb.png" },
  { naam: "Henny Gouw", foto: "/players/hennyg.png" },
  { naam: "Cees de Graaf", foto: "/players/ceesdg.png" },
  { naam: "Henk de Graaf", foto: "/players/henkdg.png" },
  { naam: "Cor Heijboer", foto: "/players/corh.png" },
  { naam: "Jan Hollemans", foto: "/players/tijdelijk.png" },
  { naam: "Ed Jonker", foto: "/players/edj.png" },
  { naam: "Arie Langstraat", foto: "/players/ariel.png" },
  { naam: "Piet van Loon", foto: "/players/pietvl.png" },
  { naam: "Cees Meeuwis", foto: "/players/ceesm.png" },
  { naam: "Huug Noordermeer", foto: "/players/huugn.png" },
  { naam: "Dick Nugteren", foto: "/players/dickn.png" },
  { naam: "John Schaap", foto: "/players/johns.png" },
  { naam: "Martin Schoenmakers", foto: "/players/martin.png" },
  { naam: "Pieter Slijkoord", foto: "/players/pieters.png" },
  { naam: "Wim Smit", foto: "/players/wims.png" },
  { naam: "Aad Tettero", foto: "/players/aadt.png" },
  { naam: "Cees van Tooren", foto: "/players/ceesvt.png" },
  { naam: "Johan van Zon", foto: "/players/johanvz.png" },
  { naam: "Gerard Klaui", foto: "/players/tijdelijk.png" },
  { naam: "Henny de Graaf", foto: "/players/hennydg.png" },
  { naam: "Leo Koster", foto: "/players/leo.png" },
  { naam: "Invaller 1", foto: "/players/tijdelijk.png" },
];

export default function WieDoetMee() {
  // spelers selectie
  const [geselecteerd, setGeselecteerd] = useState<string[]>([]);

  // actieve banen (a, b, c, d)
  const [banen, setBanen] = useState<string[]>([]);

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
      {/* Spelers */}
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
                transition: "opacity 0.15s ease",
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

      {/* Banen A B C D */}
            {/* Banen knoppen */}
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
              transition: "opacity 0.15s ease",
            }}
          />
        ))}
      </div>

      {/* INDELEN knop */}
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
