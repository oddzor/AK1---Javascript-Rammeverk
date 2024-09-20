# Reactato

#### Created by Odd Grimholt
#### oddgrimholt@gmail.com

---

### Table of Contents

1. General
2. Dependencies
3. Functionality
4. Notes

---

## General

#### Reactato is a simple reaction game created for a Javascript Frameworks class assignment.
#### Made in HTML, CSS and ReactJS with a SQL database via Supabase

---

## Dependencies

#### App is standalone, provided that the database is still live.

---

## Functionality 

### Game

#### A 4x4 grid will show images of potatoes for 2 seconds, you have 60 seconds to click as many of the "obvious" potatoes as possible. For every correct click, a new set loads and your allocated time to click will decrease, for every incorrect click your allocated time will increase. 
#### Points are awarded based on correct click, and the speed of the click. Max points are 100, decreasing with your allocated reaction time.
#### Points are uploaded to SQL database hosted on Supabase, and Top10 scores are displayed on the highscore list.


## Notes

#### Potato