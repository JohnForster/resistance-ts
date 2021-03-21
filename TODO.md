# TODO LIST

#### COMPLETED:

- ⭐️ Add server stuff for creating a player on connection. ✅
- ⭐️ Probably need to use cookies/local storage for user identification rather than IP? ✅
- ⭐️ Display name entry page before host/join page. ✅
- ⭐️ Deal with beginning of game - showing if you are resistance or not. ✅
- ⭐️ Add Styled components ✅
- ⭐️ Confirm allegiance and monitor confirmations ✅
- 🔧 Refactor game.ts into multiple classes. (Nomination round, character selection round etc.) ✅
- 🔧 Replace characters, allegiance, event types etc. with string enums ✅
- 🔧 Replace string union types with enums ✅
- 🔧 Add alias for @shared, @client and @server ✅
- 🔧 Replace event types with EventByName<'eventName'> ✅
- 🔧 Types for RoundData ✅
- ⭐️ Implement NOMINATION and VOTING ✅
- ⭐️ Implement MISSIONS ✅
- 🐞 Prevent homescreen from flashing up before changing to latest screen? ✅
- ⭐️ Show mission progress ✅
- 🔧 Server refactor ✅
- 🔧 Client Refactor ✅
- 🔧 Sockets.io ✅
- 🔧 Fix prod build ✅
- ⭐️ E2E tests ✅
- ⭐️ Add vote results page ✅
- 🔧 Split node_modules between client/server ✅
- 🔧 (mostly) Replace babel with typescript ✅
- 🐞 No feedback on submitting mission choice ✅
- 🐞 Prevent disconnection ✅
- ⭐️ Add endgame pages ✅
- ⭐️ Add quit game functionality in lobby/elsewhere ✅

---

#### FEATURES:

- ⭐️ Add loading display
- ⭐️ Improve endgame pages
- ⭐️ Characters
- ⭐️ Character selection
- ⭐️ Remove hostID

---

#### BUGS:

- 🐞 Small screens probably cannot handle large games. (Allow scrolling?)
- 🐞 Small screens cannot fully show the nomination vote page with long names.
- 🐞 Opening two tabs allows one user to have two websocket connections open? - Close one websocket on opening another.
- 🐞 Probably need to close/clear games that haven't been used in a while.
- 🐞 Do nominations cycle?

---

#### TECH DEBT:

- 🔧 Test on real phones
- 🔧 Refactor react classes into functional components
- 🔧 Split ids into private/public?
- 🔧 Go through TODO comments
- 🔧 Split events between client/server
- 🔧 Rename files to their exports