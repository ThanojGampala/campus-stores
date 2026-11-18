# Campus Stores: my submission

Would I keep this product? Yes. It gets the hard part right: it always knows which physical unit is where. What it can't do is remember what the desk is told at the counter, and that is the one thing I changed.

To try it, open `index.html` (or run `python3 -m http.server 8000 --bind 127.0.0.1` and go to `http://localhost:8000`), press **Restart sample shift** and play the shift. Everything I changed shows up in the Loan register. The code is in `app.js` and `styles.css`.

## What it does well

At 3:45 on Friday, Kabir is at the counter and the film starts at four. I issued the projector, speaker and adapter on the Film Society request.

When I opened the unit list for the projector, PR-04 was the only one there. PR-06 is in the workshop and the app simply doesn't offer it, so there was no way to send a broken projector to a screening. I also tried adding the second adapter, AD-15, to the same request. The app stopped me with "The approved quantity of this equipment type is already on loan." It did the same when I tried to add the camera.

That's the right instinct for a counter under time pressure. The app doesn't expect you to remember the rules. It just doesn't let you get them wrong.

## What I'd change

The handover, from 7:30 on Friday evening to 9 the next morning.

At 7:30, Kabir brought back the projector and speaker and told me Leela still had the adapter and would drop it in at nine. I closed those two slips (L-402 and L-403). The adapter's slip, L-404, had one button: Record return. There was nowhere to put what Kabir had just told me, so I wrote it in the desk book as a note.

Then I moved the clock to Saturday morning and played the new person on the desk. The register said:

```
L-404 · AD-12
RQ-214 · Kabir Sen · Due Fri 8 pm
```

It doesn't say AD-12 is an adapter, and it doesn't say Leela has it. It also doesn't say the adapter is thirteen hours late; nothing in the app ever marks a loan as late. To work out what was going on I had to check three screens while someone waited at the counter:
- the register, to see that AD-12 was still out;
- Inventory, to learn what AD-12 is, and that a second adapter of the same type, AD-15, lives in the same bin;
- the desk book, to find Leela's name.

Closing the loan was risky too. Record return closes a slip in one click with no undo, and the adapter's button sat directly above the one for Tara's microphone. When I did close the adapter, the message said "AD-12 returned to stock" and nothing about whether the Film Society's kit was now complete.

The real problem is simple. Three people are involved in this one loan: Isha asked for it, Kabir collected it, and Leela is bringing part of it back. The slip has room for one name, so everything the evening shift learned ends up in a notebook instead of on the record.

## The change

I made the loan slip hold what the desk knows. There are three parts to it.

**Not back yet.** Every open slip now has a Not back yet button. It asks who has the item now and when it's coming back.
- You can type any name; people the desk already knows are suggested. You pick the return date from a calendar and type the time. A time that has already passed is refused. The desk clock now shows the date as well, so it's clear what "tomorrow" means.
- The answer is saved on the slip, and the slip stays in Kabir's name, so the club is still responsible. Libraries work the same way: anyone can return an item, but it stays on the borrower's record until it's actually back.
- Saving also writes the line into the desk book, so nobody has to type it twice. If the name isn't one the desk knows, the desk book says so.

I kept "Collected by" at pickup as a fixed list on purpose. Handing kit out is where approval matters. Bringing it back isn't.

**Slips that say what they are.**
- Each slip now shows what the item is, which club has it, who is holding it and when it's due.
- Slips are marked Late or Due now against the desk clock, and the most urgent come first.
- The Loan register in the menu shows "1 due now" or "1 late", so the morning shift knows where to look.
- Inventory shows who has each unit, and each request shows where its items are.

**Check in from the counter.** At the top of the register there is now a box called At the counter. You type whatever you have in front of you: the label on the item, or the name of the person holding it.
- If one slip matches, its check-in opens.
- Before closing, it asks you to check the label and names any look-alikes, for example "Looks the same: AD-15 · Anker A8312, on shelf C4".
- It records who brought the item in, and the message afterwards tells you what's still out on that request.
- If you type a label that isn't on any open slip, it tells you where that unit should be instead. That stops you closing the wrong slip.

## The same shift with the change

**Friday, 3:45.** Pickup works exactly as before. The slips now read like "AD-12 · USB-C → HDMI adapter, Film Society (RQ-214), issued to Kabir Sen, due Fri 8 pm".

**Friday, 7:30.**
1. I type PR-04. Its check-in opens, I check the label and confirm. The app tells me the Film Society still has SP-02 and AD-12 out.
2. Same for the speaker. Now only AD-12 is left.
3. On AD-12 I press Not back yet, type Leela, pick Saturday's date, set 9:00 am and save.

The slip now says that Leela has the adapter, that she's bringing it back on Saturday at 9:00 am, and that it was due on Friday at 8 pm. The desk book has the same line.

**Saturday, 9:00.**
1. The menu says Loan register, 1 due now. The adapter is at the top of the list, marked Due now, with Leela's name on it. Tara's mic is underneath, due at ten.
2. Leela is at the counter, so I type her name. The adapter's check-in opens. It reminds me that AD-15 looks the same and should be on the shelf, and it already has Leela filled in as the person returning it.
3. I check that the label says AD-12 and confirm. The app says "AD-12 checked in from Leela Das. Slip L-404 closed. Film Society (RQ-214): everything is back."

If the label had said AD-15, typing it would have told me that AD-15 isn't on any open slip and belongs on shelf C4. L-404 would stay open until the right adapter turned up.

What took three screens and a notebook now takes one screen.

## What I kept

- **One slip per physical unit.** It's the reason a partial return can be recorded at all, and the whole change sits on top of it.
- **The checks at issue time:** nothing in repair, nothing outside the request, nothing over the approved quantity. Untouched.
- **The desk book**, for the things people tell each other. It now also gets lines from the register.
- **The look and layout.** The change works at phone width and in dark mode, and a shift saved by the original version still loads.

## One thing I'd watch at a real counter

On a morning shift, watch the first person who brings back something the evening shift marked Not back yet. Does the staffer close the right slip without opening the desk book or asking anyone?

In the original app they can't, because the slip doesn't have the answer. If people are still reaching for the desk book or messaging the evening staffer after a couple of weeks, the slip isn't showing enough and I'd change what's on it. Closing the wrong slip, such as the other adapter or Tara's mic, counts as a miss too.

## Ideas for later

I kept the change focused, but these two are what I'd do next.

**Ask whether it still works, and tell the club.** The app's best guard is keeping PR-06 away from borrowers, but nothing in the app can put a unit into repair, because check-in never asks about condition. If the projector had come back on Friday with a dead lamp, it would have gone straight back on the shelf and the next club would find out at their event.

I'd add one choice at check-in: Works or Needs a look. Needs a look moves the unit to repair. Either way, the person who signed the request (Isha) gets a short note while the return is still fresh, saying what came back, what's still out and anything that was found. For Friday night that note would read: "2 of 3 back. AD-12 is with Leela, due Saturday 9:00 am." Car rental desks do the same walk-round with the customer standing there, so there's no argument later.

**A plan for the day.** The morning shift only hears about Leela. But Tara's mic is due at ten, and the Photo Circle request says their camera is being collected on Saturday morning. A short list at the start of each shift of what's coming back and what's going out, like the arrivals and departures list at a hotel desk, would cover that.

## Running it

Open `index.html` in a modern browser. It runs offline. To serve it locally instead, run this from the repository folder and visit `http://localhost:8000`:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser keeps its own sample shift. **Restart sample shift** puts the fictional records back to the start.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).
