git add -A
set commitmsg=%1
git commit -m %commitmsg% 
:: git push -u origin prompt-parallel-execution
git push -u origin main
