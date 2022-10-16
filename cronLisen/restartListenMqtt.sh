forever stop ListenAndSave.js;
forever start -o out.log -e err.log ListenAndSave.js;
tail -100f out.log;