mkdir -p example/node_modules/bs-tailwind;
cp -f bs-tailwind.js example/node_modules/bs-tailwind/bs-tailwind;
cd example/node_modules/.bin;
rm bs-tailwind;
ln -s ../bs-tailwind/bs-tailwind bs-tailwind;
cd ../../../;
