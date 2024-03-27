import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { light } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Window from './animations/Window';
import {
	BarChart,
	Calendar,
	MousePointerSquare,
	PanelLeftOpen,
	Plug,
	Table,
	Type
} from 'lucide-react';
import useAnimateScroll, {
	appScrollCount,
	flowScrollCount,
	scriptScrollCount
} from './animations/useAnimateScroll';
import { SiTypescript } from 'react-icons/si';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export default function AppAnimation({ active }) {
	const [step, setStep] = React.useState(0);
	const [scriptStep, setScriptStep] = React.useState(0);
	const [buttonName, setButtonName] = React.useState('Press me');
	const [clicked, setClicked] = React.useState(false);

	const [selectedComponent, setSelectedComponent] = React.useState(null);

	// 10, 15, 30, 45, 60, 72, 90
	const steps = [
		{
			scroll: 10,
			callback: () => {
				setScriptStep(1);
				setSelectedComponent('button');
			},
			rollback: () => {
				setScriptStep(0);
				setSelectedComponent(null);
			}
		},
		{
			scroll: 15,
			callback: () => {
				setButtonName('Load Refunds');
			},
			rollback: () => {
				setButtonName('Press me');
			}
		},
		{
			scroll: 30,
			callback: () => {
				setScriptStep(2);
			},
			rollback: () => {
				setScriptStep(1);
			}
		},

		{
			scroll: 45,
			callback: () => {
				setScriptStep(3);
				setSelectedComponent('table');
			},
			rollback: () => {
				setScriptStep(2);
				setSelectedComponent('button');
			}
		},
		{
			scroll: 60,
			callback: () => {
				setScriptStep(4);
				setSelectedComponent('button');
			},
			rollback: () => {
				setScriptStep(3);
				setSelectedComponent('table');
			}
		},
		{
			scroll: 72,
			callback: () => {
				setClicked(true);
				setTimeout(() => {
					setClicked(false);
				}, 200);
			},
			rollback: () => {}
		},
		{
			scroll: 90,
			callback: () => {
				setScriptStep(5);
			},
			rollback: () => {
				setScriptStep(4);
			}
		},
		{
			scroll: 99,
			callback: () => {},
			rollback: () => {}
		}
	];

	const variants = {
		variant0: { top: 180, left: 675, text: 'Build complex apps from 50+ atomic components.' },
		variant1: { top: 150, left: 720, text: 'Easily configure the properties.' },

		variant2: {
			top: 260,
			left: 300,
			text: 'Add interactions with inlined scripts or scripts from your workspace.',
			displayArrow: false
		},
		variant3: {
			top: 120,
			left: 720,
			text: 'Connect result from one component to another, and build complex logic.'
		},
		variant4: {
			top: 120,
			left: 180,
			text: 'Test your app directly, and iterate quickly.'
		},
		variant5: {
			top: 360,
			left: 300,
			text: 'Build complex apps with our 50+ atomic components, and add code only when needed.',
			displayArrow: false
		}
	};

	useAnimateScroll(active, steps, appScrollCount, flowScrollCount + scriptScrollCount);

	return (
		<div className=" bg-gradient-to-br from-orange-200 to-orange-400 dark:from-orange-700 dark:to-orange-600 w-full rounded-lg p-6 shadow-inner overflow-hidden  h-[550px]">
			<Window
				lightMode
				shouldRender={step === 0}
				name="Chrome"
				icon="/third_party_logos/chrome.svg"
			>
				<div className="flex flex-row h-full">
					<div className="h-full border-r border-gray-950 bg-gray-900 px-2 py-1 flex flex-row items-start overflow-hidden text-gray-300 text-xs font-semibold gap-2">
						<img src="/img/windmill.svg" alt="windmill" className="h-6 w-6" />
					</div>
					<div className="grid grid-cols-12 w-full h-full divide-x divide-gray-100">
						<div className="col-span-2 py-2 ">
							<div className=" text-gray-500 px-2 ">Outputs</div>
							<div className="border-y px-2 my-1 bg-gray-50 text-gray-500">Context</div>
							<div className="border-b px-2 text-xs pb-1 text-gray-500">
								<div>email: admin@windmill.dev</div>
							</div>
							<div className="border-y px-2 my-1 bg-gray-50 text-gray-500">Button</div>
							<div className="border-b px-2 text-xs pb-1 text-gray-500">
								<div>result: [...]</div>
							</div>
							<div className="border-y px-2 my-1 bg-gray-50 text-gray-500">Table</div>
							<div className="border-b px-2 text-xs pb-1 text-gray-500">
								<div>result: {scriptStep >= 5 ? '[...]' : 'undefined'}</div>
							</div>
						</div>

						<div className="col-span-7 text-gray-500 text-sm">
							<div className="grid grid-rows-3 divide-y h-full divide-gray-100">
								<div className="row-span-2  relative	overflow-hidden">
									<div className="absolute z-50 px-8 pt-8">
										{scriptStep >= 1 && (
											<button
												className={twMerge(
													'relative bg-blue-500 text-lg text-white px-2 py-1',
													clicked ? 'opacity-50' : '',
													selectedComponent === 'button'
														? 'outline outline-2 outline-offset-2 outline-indigo-500'
														: ''
												)}
											>
												{buttonName}
												{selectedComponent === 'button' && (
													<div className="absolute z-50 -top-5 -left-1 h-4 text-xs text-white flex items-center justify-center bg-indigo-500 px-2 !opacity-100">
														Button
													</div>
												)}
											</button>
										)}
									</div>
									<div className="absolute top-12 inset-0 h-full p-8  w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
										<input
											type="text"
											className="w-full h-8 rounded-md bg-white text-lg border-gray-200 my-4 px-2 py-2 text-gray-400"
											value="Filter..."
											disabled
										/>
										<div
											className={twMerge(
												'relative',
												selectedComponent === 'table'
													? 'outline outline-2 outline-offset-2 outline-indigo-500'
													: ''
											)}
										>
											{selectedComponent === 'table' && (
												<div className="absolute z-50 -top-5 -left-1 h-4 text-xs text-white flex items-center justify-center bg-indigo-500 px-2 !opacity-100">
													Table
												</div>
											)}
											<table className=" !border-gray-200 !text-gray-400">
												<thead className="!border-gray-200 !bg-white !text-gray-400">
													<tr>
														<th className="!border-gray-200 !bg-white !text-gray-600 font-normal">
															Charge
														</th>
														<th className="!border-gray-200 !bg-white !text-gray-600 font-normal">
															Amount
														</th>
													</tr>
												</thead>
												<tbody className="!border-gray-200 !bg-white !text-gray-600 font-normal">
													{scriptStep >= 5 ? (
														<>
															<tr>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	ch_1NirD82eZ
																</td>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	299
																</td>
															</tr>
															<tr>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	ch_2TpG09eZ
																</td>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	456
																</td>
															</tr>
															<tr>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	ch_3Tlkj6rt
																</td>
																<td className="!border-gray-200 !bg-white !text-gray-600 font-normal">
																	167
																</td>
															</tr>
														</>
													) : (
														<tr className="!border-gray-200 !bg-white  font-normal">
															<td colSpan={2} className="!text-gray-600 !border-gray-200">
																No refunds found. Click 'Load Refunds' to load
															</td>
														</tr>
													)}
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div className="row-span-1">
									<div className="grid grid-cols-6 w-full h-full divide-x divide-gray-100">
										<div className="col-span-2 h-full flex flex-col p-2">
											{scriptStep >= 2 && (
												<div className="border-2 border-gray-200 rounded-sm p-2 text-md flex flex-row gap-2 items-center justify-center outline outline-2 outline-offset-2 outline-indigo-500">
													<SiTypescript className="h-4 w-4" />
													Load refunds
												</div>
											)}
										</div>
										{scriptStep >= 2 && (
											<SyntaxHighlighter
												language="javascript"
												style={light}
												className="rounded-none text-sm col-span-4 !font-light !bg-white"
												showLineNumbers
											>
												{`import Stripe from 'stripe';

export async function main() {
  const refunds = await stripe.refunds.list();
	return refunds;
}`}
											</SyntaxHighlighter>
										)}
									</div>
								</div>
							</div>
						</div>
						{scriptStep === 0 && (
							<div className="col-span-3 p-2 text-gray-500 text-sm">
								<div>Components</div>
								<input
									type="text"
									className="w-full h-8 rounded-md bg-white text-gray-300 text-md border-gray-200 my-2 px-2"
									value="Search..."
									disabled
								/>
								<div className=" grid grid-cols-2 gap-1">
									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<MousePointerSquare className="h-4 w-4" />
										<div>Button</div>
									</div>
									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<Table className="h-4 w-4" />
										<div>Table</div>
									</div>
									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<BarChart className="h-4 w-4" />
										<div>Chart</div>
									</div>
									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<PanelLeftOpen className="h-4 w-4" />
										<div>Drawer</div>
									</div>
									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<Type className="h-4 w-4" />
										<div>Text</div>
									</div>

									<div className="border col-span-1 h-16 flex flex-col justify-center items-center border-gray-100 rounded-md gap-1">
										<Calendar className="h-4 w-4" />
										<div>Time</div>
									</div>
								</div>
							</div>
						)}
						{scriptStep >= 1 && scriptStep < 3 && (
							<div className="col-span-3 p-2 text-gray-500 text-sm w-full">
								<div className="font-semibold">Runnable</div>
								<div className="mb-4">{scriptStep >= 2 && <div>Load refunds </div>}</div>
								<div className="font-semibold">Label</div>
								<input
									type="text"
									className=" h-8 rounded-md bg-white  text-md border-gray-200 my-2 px-2 w-full"
									value={buttonName}
									disabled
								/>
								<div className="font-semibold">Color</div>
								<input
									type="text"
									className="w-full h-8 rounded-md bg-white text-md border-gray-200 my-2 px-2"
									value="blue"
									disabled
								/>
								<div className="font-semibold">Size</div>
								<input
									type="text"
									className="w-full h-8 rounded-md bg-white text-md border-gray-200 my-2 px-2"
									value="md"
									disabled
								/>
							</div>
						)}
						{scriptStep >= 3 && (
							<div className="col-span-3 p-2 text-gray-500 text-sm w-full">
								<div className="font-semibold">Table input</div>
								<button
									className={twMerge(
										'border border-gray-200 rounded-md p-2 text-md w-full flex flex-row gap-2 items-center',
										scriptStep >= 4 ? 'border-red-500 text-red-500' : ''
									)}
								>
									<Plug className="h-4 w-4" />
									{scriptStep >= 4 ? 'Disconnect' : 'Connect to button result'}
								</button>
								<div className="font-semibold mt-2">Expression</div>

								<input
									disabled
									type="text"
									className="w-full h-8 rounded-md bg-white text-md border-gray-200 my-2 px-2"
									value={scriptStep >= 4 ? 'button.result' : ''}
								/>

								<div className="font-semibold">Search</div>
								<input
									type="checkbox"
									className="h-4 w-4 rounded-md bg-white  text-md border-gray-200 my-2 px-2 "
									disabled
									checked={true}
								/>
								<div className="font-semibold">Download button</div>
								<input
									type="checkbox"
									className="h-4 w-4 rounded-md bg-white  text-md border-gray-200 my-2 px-2 "
									disabled
									checked={false}
								/>
							</div>
						)}
					</div>
				</div>
				{variants?.[`variant${scriptStep}`] && (
					<motion.div
						animate={`variant${scriptStep}`}
						variants={variants}
						className={twMerge(
							'absolute bg-gray-950 text-white shadow-xl z-50 p-4 text-md rounded-lg border border-gray-950 w-56',
							variants?.[`variant${scriptStep}`]?.displayArrow === false ? '!w-96' : ''
						)}
					>
						{variants?.[`variant${scriptStep}`]?.displayArrow !== false && (
							<div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-3 h-3 bg-gray-950 transform rotate-45 border border-gray-950"></div>
						)}
						{variants?.[`variant${scriptStep}`]?.text}
					</motion.div>
				)}
			</Window>
		</div>
	);
}
