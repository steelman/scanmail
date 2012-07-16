/* Scan'Mail 
 * version 0.1 (2011/05)
 * Author : Nassim KACHA <nassim.kacha@blueicefield.com>
 * License : GNU AFFERO GENERAL PUBLIC LICENSE
 *                      Version 3
 */ 
 
 
// As we use Google Chart API to generate the QR code,
// we display the menu entries only if an internet connexion is available
function display() {
	ShowMenuItem("scanmail-menuseparator", window.navigator.onLine);
	ShowMenuItem("scanmail-emailAddressPopup", window.navigator.onLine);
}
