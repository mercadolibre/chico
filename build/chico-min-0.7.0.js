<br />
<b>Fatal error</b>:  Uncaught exception 'JSMinException' with message 'Unterminated regular expression literal.' in /Users/pazguille/developer/chicomaster/php/jsmin.php:124
Stack trace:
#0 /Users/pazguille/developer/chicomaster/php/jsmin.php(236): JSMin-&gt;action(1)
#1 /Users/pazguille/developer/chicomaster/php/jsmin.php(65): JSMin-&gt;min()
#2 /Users/pazguille/developer/chicomaster/php/packer.php(79): JSMin::minify('/**? * Chico-UI...')
#3 /Users/pazguille/developer/chicomaster/php/packer.php(192): Packer-&gt;minSource('/**? * Chico-UI...')
#4 /Users/pazguille/developer/chicomaster/php/packer.php(237): Packer-&gt;deliver()
#5 {main}
  thrown in <b>/Users/pazguille/developer/chicomaster/php/jsmin.php</b> on line <b>124</b><br />
