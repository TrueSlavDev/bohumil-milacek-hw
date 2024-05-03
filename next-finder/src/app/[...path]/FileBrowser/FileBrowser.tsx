"use client";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

interface File {
	path: string;
	type: "directory" | "file" | "unknown";
}

interface FileBrowserProps {
	className?: string;
}

export function FileBrowser({ className }: FileBrowserProps) {
	const path = usePathname();
	const router = useRouter();

	const [files, setfiles] = useState<File[]>();
	const [error, setError] = useState<string>();

	const setNewFiles = (files: File[]) => {
		const newFiles = [...files];
		if (path !== "/") newFiles.unshift({ path: "..", type: "directory" });
		newFiles.unshift({ path: ".", type: "directory" });
		setfiles(newFiles);
	};

	useEffect(() => {
		setError(undefined);
		const getFiles = async () => {
			try {
				const filesResponse = await axios.get<File[]>("http://localhost:3101/api/directory", {
					params: {
						path,
					},
				});
				setNewFiles(filesResponse.data);
			} catch (error) {
				if (error instanceof AxiosError) {
					if (error.response?.status === 404) setError("Path does not exist");
					else setError("An error occurred");
				}
			}
		};

		getFiles();
	}, [path]);

	const handleFileClick = (newDirectory: string) => {
		if (newDirectory === ".") {
			return;
		} else if (newDirectory === "..") {
			router.back();
		}
		const newPath = path === "/" ? `/${newDirectory}` : `${path}/${newDirectory}`;
		setfiles(undefined);
		router.push(newPath);
	};
	return (
		<>
			<List>
				{files?.map((file) => (
					<ListItem button key={file.path} onClick={() => file.type === "directory" ? handleFileClick(file.path) : () => {/* TODO open file*/ }}>
						{file.type === "directory" ? <FolderIcon /> : <DescriptionIcon />}
						<ListItemText primary={file.path} />
					</ListItem>
				))}
			</List>
		</>
	);
}
