# 🎵 Strudel Playground

**Une interface minimaliste et stylée pour générer de la musique live avec Strudel**

![Strudel Playground](https://img.shields.io/badge/Strudel-Playground-ff006e?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-00d9ff?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6-8338ec?style=for-the-badge)

---

## 🎯 Concept

Un playground ultra simple pour jouer avec **Strudel** (livecoding audio) sans complexité technique.
Générez de la musique en live, visualisez le son, et sentez la vibe.

### ✨ Fonctionnalités

- 🎛 **Pattern input** : Tapez des patterns simples (`bd hh sn hh`, `bd [hh sn]`, etc.)
- 🎧 **Visualiseur audio** : Oscilloscope + spectre fréquentiel en temps réel
- ▶️ **Contrôles intuitifs** : Play/Stop + slider de tempo
- 💡 **Feedback visuel** : Pulsations, animations, level meter
- 🌈 **Interface moderne** : Style minimal avec palette néon (bleu/rose/violet)
- 📱 **Responsive** : Fonctionne sur mobile et desktop

---

## 🚀 Installation

```bash
# Cloner le repo
git clone <repo-url>
cd Strudel-ui

# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

---

## 🎮 Utilisation

1. **Ouvrez l'application** dans votre navigateur
2. **Tapez un pattern** dans la zone de texte (ex: `bd hh sn hh`)
3. **Appuyez sur PLAY** pour démarrer la musique
4. **Ajustez le tempo** avec le slider
5. **Regardez le visualiseur** s'animer au rythme

### 📝 Exemples de patterns

```javascript
bd hh sn hh                    // Pattern simple
bd [sn hh] bd bd               // Subdivision
bd*4 sn:2 hh*8                 // Répétitions
sound("bd cp sd cp")           // Avec la fonction sound
```

Pour plus d'exemples, visitez [strudel.cc](https://strudel.cc)

---

## 🛠 Stack technique

- **React 18** : Framework UI
- **Vite 6** : Build tool ultra-rapide
- **Tailwind CSS** : Styling utilitaire
- **Strudel** : Engine audio (port JavaScript de TidalCycles)
  - `@strudel/core` : Core pattern library
  - `@strudel/mini` : Mini notation API
  - `@strudel/webaudio` : Web Audio integration

---

## 📦 Build

```bash
# Build pour production
npm run build

# Preview du build
npm run preview
```

Les fichiers de build seront générés dans `dist/`

---

## 🎨 Style

L'interface utilise une palette restreinte pour un rendu épuré :

- **Neon Blue** : `#00d9ff` - Éléments interactifs
- **Neon Pink** : `#ff006e` - État actif / Live
- **Neon Purple** : `#8338ec` - Accents
- **Neon Green** : `#3ddc84` - (réservé pour extensions)

Le design s'inspire de :
- TidalToy
- Ableton Push
- Teenage Engineering OP-Z

---

## 🧩 Structure du projet

```
src/
├── components/
│   ├── Controls.jsx         # Play/Stop + Tempo slider
│   ├── PatternInput.jsx     # Zone de saisie de pattern
│   ├── Visualizer.jsx       # Oscilloscope + spectre
│   └── FeedbackBar.jsx      # Level meter + beat indicators
├── hooks/
│   └── useStrudel.js        # Hook pour gérer Strudel
├── App.jsx                  # Composant principal
├── main.jsx                 # Point d'entrée
└── index.css                # Styles Tailwind
```

---

## 📄 Licence

Ce projet utilise Strudel, qui est sous licence **GNU Affero GPL v3**.

---

## 🔗 Liens

- [Strudel](https://strudel.cc/) - Site officiel
- [Documentation Strudel](https://strudel.cc/workshop/getting-started/)
- [TidalCycles](https://tidalcycles.org/) - Inspiration originale

---

**Fait avec ❤️ et beaucoup de ✨**
