# Webaudio tracker

webaudio based music tracker, this is a WIP


## usage 

> npm run dev

## notation

| notation | description                             |
| -------- | --------------------------------------- |
| i        | represents a positive integer number    |
| x        | represents an hexadecimal number        |
| [A-Z]    | letters from A to Z represents commands |

| command  | description                             |
| -------- | --------------------------------------- |
| Si       | set sample                              |
| Ri       | set pitch                               |
| Vi       | set volume                              |
| Px       | set panning                             |
| Ax       | set attack 1/x                          |
| Dx       | set decay                               |
| Ei       | set duration                            |
| [A-Z]+i  | adds i to [A-Z] command value           |
| [A-Z]-i  | substracts i to [A-Z] command value     |
| [A-Z]\*i | multiplies i to [A-Z] command value     |
| [A-Z]/i  | divides i to [A-Z] command value        |
| [A-Z]%i  | module i of [A-Z] command value         |
| [A-Z]>i  | sets the value i>command value of [A-Z] |
| [A-Z]<i  | sets the value i<command value of [A-Z] |
| $i       | read from global variable i             |

examples:

```
S1 R2
plays sample 1 with pitch 2

S2 P2 A2 V/2
plays sample 2 with panning 2 and volume as the result of V/2

S3 E2
plays sample with duration of 2 seconds
```
