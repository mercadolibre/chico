
$TAGS=$(`git tag`)

echo $TAGS

for TAG in $TAGS
do
  echo "$TAG"
done
