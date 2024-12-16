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

  // Memoize selected font value
  const selectedValue = useMemo(
    () => Array.from(fontOptions).join(', ').replace(/_/g, ''),
    [fontOptions]
  );

  // Optimize submit handler with useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Reset previous image and show loading
      setImageUrl(null);
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api?width=${width}&height=${height}&text=${encodeURIComponent(text)}&font=${selectedValue}&fontSize=${fontSize}`
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
        // Optional: Add error state handling
      } finally {
        setIsLoading(false);
      }
    },
    [width, height, text, selectedValue, fontSize]
  );

  // Clean up blob URL to prevent memory leaks
  React.useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <Form
          className="w-full space-y-6"
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
          <Input
            label="Font size"
            labelPlacement="outside"
            name="fontSize"
            placeholder="20"
            type="number"
            variant="bordered"
            value={fontSize.toString()}
            onValueChange={(value) => setFontSize(Number(value))}
          />
          <Dropdown>
            <DropdownTrigger>
              <Button className="w-full" variant="bordered" color="default">
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Font selection"
              selectedKeys={fontOptions}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(keys) =>
                setFontOptions(new Set(Array.from(keys).map(String)))
              }
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
            isLoading={isLoading}
          >
            Generate
          </Button>
        </Form>

        {isLoading && (
          <div className="w-full flex justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {imageUrl && (
          <div className="w-full flex justify-center">
            <Image
              width={imageWidth}
              height={imageHeight}
              src={imageUrl}
              alt="Generated SVG"
              className="max-w-full"
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
}
