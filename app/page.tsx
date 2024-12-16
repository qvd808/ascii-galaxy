"use client";
import React, { useState } from 'react';
import { Form } from '@nextui-org/form';
import { Input } from '@nextui-org/input';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';

export default function Home() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(200);
  const [text, setText] = useState('');
  const [fontOptions, setFontOptions] = React.useState(new Set<string>(["Standard"]));
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const selectedValue = React.useMemo(
	() => Array.from(fontOptions).join(", ").replace(/_/g, ""),
	[fontOptions],
  );

  const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault();

	try {
	  const response = await fetch(`/api?width=${width}&height=${height}&text=${encodeURIComponent(text)}&font=${selectedValue}&fontSize=20`);

	  if (!response.ok) {
		throw new Error('Network response was not ok');
	  }

	  const svgText = await response.text();
	  const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
	  const svgUrl = URL.createObjectURL(svgBlob);

	  setImageUrl(svgUrl);
	} catch (error) {
	  console.error('Error:', error);
	}
  };

  return (
	<div className='flex justify-center items-center min-h-screen'>
	  <div className='w-full max-w-md space-y-6'>
		<Form 
		  className='w-full space-y-4' 
		  validationBehavior='native'
		  onSubmit={handleSubmit}
		>
		  <Input
			label="Width"
			labelPlacement="outside"
			name="width"
			placeholder="400"
			type="number"
			variant="bordered"
			value={width.toString()}
			onValueChange={(value) => setWidth(Number(value))}
		  />
		  <Input
			label="Height"
			labelPlacement="outside"
			name="height"
			placeholder="200"
			type="number"
			variant="bordered"
			value={height.toString()}
			onValueChange={(value) => setHeight(Number(value))}
		  />
		  <Input
			isRequired
			errorMessage="Please provide a text message"
			label="Text"
			labelPlacement="outside"
			name="text"
			placeholder="Hello world"
			type="text"
			variant="bordered"
			value={text}
			onValueChange={setText}
		  />
		  <Dropdown>
			<DropdownTrigger>
			  <Button 
				className="w-full" 
				variant="bordered"
				color="default"
			  >
				{selectedValue}
			  </Button>
			</DropdownTrigger>
			<DropdownMenu
			  disallowEmptySelection
			  aria-label="Font selection"
			  selectedKeys={fontOptions}
			  selectionMode="single"
			  variant="flat"
			  onSelectionChange={(keys) => setFontOptions(new Set(Array.from(keys).map(String)))}
			>
			  <DropdownItem key="Standard">Standard</DropdownItem>
			  <DropdownItem key="Serif">Serif</DropdownItem>
			  <DropdownItem key="Monospace">Monospace</DropdownItem>
			</DropdownMenu>
		  </Dropdown>
		  <Button 
			type="submit" 
			color="primary" 
			className="w-full"
		  >
			Generate
		  </Button>
		</Form>

		{imageUrl && (
		  <div className='w-full flex justify-center'>
			<img 
			  src={imageUrl}
			  alt="Generated SVG" 
			  className='max-w-full'
			/>
		  </div>
		)}
	  </div>
	</div>
  );
}
