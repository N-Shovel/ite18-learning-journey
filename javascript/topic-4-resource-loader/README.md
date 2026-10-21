# Nimrod P. Pala ITE-18-FNHX1

## Class Resource Loader Test Results

**Correction attempted:** None needed. All tests passed when opening `index.html` in the browser.

| Test | Action | Result |
| --- | --- | --- |
| T1 | Open or reload the page | Passed. Status is `Ready.`, attempts and response clicks are `0`, and the list and trace are empty. |
| T2 | Submit with failure unchecked | Passed. `Loading...` appears immediately, attempts becomes `1`, the load button is disabled, and the list is cleared. |
| T3 | Click `Test page response` twice while loading | Passed. Response clicks reaches `2` while the request count remains `1`. |
| T4 | Wait for the successful request | Passed. Three resources appear in order, status is `Loaded 3 resources`, and the trace is `A: handler starts`, `B: before await`, `C: promise microtask`, `D: timer task`, `E: success`, `F: cleanup`. |
| T5 | Submit another successful request | Passed. Attempts becomes `2`, three rows remain after completion, and response clicks remains `2`. |
| T6 | Check failure and submit | Passed. Attempts becomes `3`, the list is cleared, the failure message appears, the button is enabled again, and the trace ends with `E: failure` and `F: cleanup`. |
| T7 | Uncheck failure and retry | Passed. Attempts becomes `4`, the request succeeds, and three resource rows appear. |
| T8 | Start unchecked, then check failure during loading | Passed. Attempts becomes `5`; the request still succeeds because the failure mode is captured at submission. |
| T9 | Uncheck failure and rapidly double-click Load | Passed. The immediate double-click guard accepts only one request; attempts becomes `6` and one final set of three rows appears. |
| T10 | Reload the page | Passed. The page returns to the T1 state; counters and results are stored only in memory. |
