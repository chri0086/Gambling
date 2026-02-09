# Casino Demo (Browser)

⚠️ **IMPORTANT NOTICE**: This is a demonstration project only. See [DESIGN_FLAWS.md](DESIGN_FLAWS.md) for critical information about security issues, addictive design patterns, and ethical concerns.

Singleplayer-Casino als Ein-Seiten-App (SPA) – komplett im Browser, ohne Backend. Enthält mehrere Spiele mit gemeinsamem Guthaben (localStorage):

- Blackjack: 6-Deck-Shoe, Dealer steht auf 17, Blackjack 3:2, Double Down
- Roulette: Rot/Schwarz, Gerade/Ungerade, Zahl (0–36)
- Slots: 3x3, 3 horizontale Gewinnlinien, einfache Symbol-Auszahlung
- Dice: Einstellbare Gewinnchance, dynamische Quote (ca. 1% House-Edge)
- Crash: Steigender Multiplikator, Cash Out vor „Bust“

Ziel ist eine grobe Orientierung am modernen Casino-Stil, ohne Marken/Designs zu kopieren.

## Starten

- Öffne einfach `index.html` im Browser (Doppelklick).

Optional lokaler Server (z. B. mit Python):

```powershell
python -m http.server 8000
```

Dann im Browser `http://localhost:8000` aufrufen und zur Datei navigieren.

## Gemeinsames Guthaben

- Startguthaben: $1,000 (lokal gespeichert)
- „Reset Guthaben“ setzt das Guthaben auf den Startwert zurück

## Spielhinweise

- Blackjack: Mindesteinsatz $5, Double nur als erste Aktion, Naturals zahlen 3:2
- Roulette: Standard-Auszahlungen (2x auf Even-Money, 36x auf Zahl)
- Slots: Multiplikatoren pro Linie – 7️⃣ x10, ⭐ x5, 🔔 x3, 🍒/🍋 x2
- Dice: Quote ≈ 0.99 / Chance, Gewinn wenn Zufall < Chance
- Crash: Zufälliger Bust-Multiplikator, rechtzeitig Cash Out drücken

## Erweiterungen (Ideen)

- Weitere Spiele: Baccarat, Mines, Plinko, Keno, Video Poker, Hi-Lo, Limbo
- Leaderboard/Verlauf, Seed-basiertes „Provably Fair"
- Animierte Reels/Transitionen, Soundeffekte, Mobile-Optimierungen

## Known Issues and Fixes

This codebase has been analyzed for errors and design flaws. Key issues fixed:
- ✅ Blackjack insurance payout logic corrected (2:1 instead of incorrect 3:1)
- ✅ Input validation added for bet amounts
- ✅ localStorage and BroadcastChannel error handling improved
- ✅ Duplicate code removed from plinko.html
- ✅ Syntax errors fixed in plinko.html

See [DESIGN_FLAWS.md](DESIGN_FLAWS.md) for complete analysis of security vulnerabilities, addictive design patterns, and remaining issues.

## Disclaimer

Dieses Projekt ist eine Demo ohne Echtgeldbezug.

**⚠️ This project contains addictive gambling mechanics that may be harmful. It is intended for educational purposes only. Do not use these patterns in real applications without implementing proper responsible gambling safeguards.**
