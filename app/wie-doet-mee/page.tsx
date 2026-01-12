"use client";

import { useState } from "react";

type Speler = {
  naam: string;
  foto: string;
};

const spelers: Speler[] = [
  { naam: "Ed B", foto: "/players/edb.png" },
  { naam: "Jan B", foto: "/players/janb.png" },
  { naam: "Henny G", foto: "/players/hennyg.png" },
  { naam: "Cees dG", foto: "/players/ceesdg.png" },
  { naam: "Henk dG", foto: "/players/henkdg.png" },
  { naam: "Cor H dG", foto: "/players/corh.png" },
  { naam: "Jan H", foto: "/players/tijdelijk.png" },
  { naam: "Ed J", foto: "/players/edj.png" },
  { naam: "Arie L", foto: "/players/ariel.png" },
  { naam: "Piet vL", foto: "/players/pietvl.png" },
  { naam: "Cees M", foto: "/players/ceesm.png" },
  { naam: "Huug N", foto: "/players/huugn.png" },
  { naam: "Dick N", foto: "/players/dickn.png" },
  { naam: "John S", foto: "/players/johns.png" },
  { naam: "Martin S", foto: "/players/martin.png" },
  { naam: "Pieter S", foto: "/players/pieters.png" },
  { naam: "Wim S", foto: "/players/wims.png" },
  { naam: "Aad T", foto: "/players/aadt.png" },
  { naam: "Cees vT", foto: "/players/ceesvt.png" },
  { naam: "Johan vZ", foto: "/players/johanvz.png" },
  { naam: "Gerard K", foto: "/players/tijdelijk.png" },
  { naam: "Henny dG", foto: "/players/hennydg.png" },
  { naam: "Leo K", foto: "/players/leo.png" },
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
