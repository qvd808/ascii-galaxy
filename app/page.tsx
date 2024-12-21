'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { Form } from '@nextui-org/form';
import { Input } from '@nextui-org/input';
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { Spinner } from '@nextui-org/spinner';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { Code } from '@nextui-org/code';
import Image from 'next/image';

export default function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [width, setWidth] = useState(800);
	const [fontSize, setFontSize] = useState(20);
	const [height, setHeight] = useState(200);
	const [imageWidth, setImageWidth] = useState(800);
	const [imageHeight, setImageHeight] = useState(200);
	const [text, setText] = useState('');
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [fontOptions, setFontOptions] = useState(new Set<string>(['Standard']));
	const [textColor, setTextColor] = useState('FFFFFF');

	const selectedValue = useMemo(
		() => Array.from(fontOptions).join(', ').replace(/_/g, ''),
		[fontOptions]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			setImageUrl(null);
			setIsLoading(true);

			try {
				const response = await fetch(
					`/api?width=${width}&height=${height}&text=${encodeURIComponent(text)}&font=${selectedValue}&fontSize=${fontSize}&textColor=${textColor}`
				);

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}

				const svgText = await response.text();
				const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
				const svgUrl = URL.createObjectURL(svgBlob);

				setImageUrl(svgUrl);
				setImageWidth(width);
				setImageHeight(height);
			} catch (error) {
				console.error('Error:', error);
			} finally {
				setIsLoading(false);
			}
		},
		[width, height, text, selectedValue, fontSize, textColor]
	);

	React.useEffect(() => {
		return () => {
			if (imageUrl) {
				URL.revokeObjectURL(imageUrl);
			}
		};
	}, [imageUrl]);

	return (
		<div className="flex min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
			{/* Left Column - Generator Form */}
			<div className="w-1/2 pr-4">
				<div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
					<Form
						className="space-y-6"
						validationBehavior="native"
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
							className="text-black dark:text-white"
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
							className="text-black dark:text-white"
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
							className="text-black dark:text-white"
						/>
						<Input
							label="Font size"
							labelPlacement="outside"
							name="fontSize"
							placeholder="20"
							type="number"
							variant="bordered"
							value={fontSize.toString()}
							onValueChange={(value) => setFontSize(Number(value))}
							className="text-black dark:text-white"
						/>
						<Input
							label="Text color"
							labelPlacement="outside"
							name="textColor"
							placeholder="FFFFFF"
							type="text"
							variant="bordered"
							value={textColor}
							onValueChange={(value) => setTextColor(value)}
							errorMessage="Please enter a valid color"
							isInvalid={!/^[0-9A-Fa-f]{6}$/.test(textColor)}
							className="text-black dark:text-white"
						/>
						<Dropdown className="flex w-full dark:bg-[#1F2937] border">
							<DropdownTrigger className="">
								<Button
									className="w-full dark:text-white dark:bg-[#1F2937] dark:border-[#374151]"
									variant="bordered"
								>
									{selectedValue}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								selectedKeys={fontOptions}
								selectionMode="single"
								className="w-[25vw] dark:text-white dark:bg-[#1F2937]"
								onSelectionChange={(keys) =>
									setFontOptions(new Set(Array.from(keys).map(String)))
								}
							>
								<DropdownItem className="" key="Standard">
									Standard
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
						<Button
							type="submit"
							color="primary"
							className="w-full"
							isLoading={isLoading}
						>
							Generate
						</Button>
					</Form>
				</div>
			</div>

			{/* Right Column - Preview and Markdown */}
			<div className="w-1/2 pl-4 space-y-6">
				{isLoading ? (
					<div className="flex justify-center items-center h-full">
						<Spinner size="lg" />
					</div>
				) : imageUrl ? (
					<div className="space-y-6">
						<div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
							<Image
								width={imageWidth}
								height={imageHeight}
								src={imageUrl}
								alt="Generated SVG"
								className="max-w-full"
								priority
							/>
						</div>
						<Card className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
							<CardHeader className="border-b border-gray-700 dark:border-gray-600">
								<h1 className="text-black dark:text-white text-xl font-semibold">
									Markdown
								</h1>
							</CardHeader>
							<CardBody className="w-full">
								<Code
									className="w-full block whitespace-pre-wrap break-all dark:text-white dark:bg-[#19191C]"
									size="lg"
									radius="sm"
								>
									{`![Title](https://ascii-galaxy.vercel.app/api?width=${width}&height=${height}&text=${encodeURIComponent(
										text
									)}&font=${selectedValue}&fontSize=${fontSize}&textColor=${textColor})`}
								</Code>
							</CardBody>
						</Card>
					</div>
				) : (
					<div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
						Generated image will appear here
					</div>
				)}
			</div>
		</div>
	);
}
