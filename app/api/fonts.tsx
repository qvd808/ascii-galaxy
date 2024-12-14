import Standard from 'figlet/importable-fonts/Standard';
import OneRow from 'figlet/importable-fonts/1Row';

type Fonts = {
  [key: string]: string;
};

const fonts: Fonts = {
	"Standard": Standard,
	"OneRow": OneRow,
};

export default fonts;
