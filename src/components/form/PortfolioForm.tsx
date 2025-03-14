import { SourceArrayForm } from "@/app/characters/create/page";
import React, { FC, useEffect, useState } from "react";

import { useFieldArray, UseFormRegister, Control, FieldErrors, useWatch, Controller } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { FileUploadForm } from "./FileUploadForm";

import { notionVerify, VerifyPageResponse } from "@/src/types/auth";

import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/lib/function";

interface PortfolioFormProps {
    register: UseFormRegister<SourceArrayForm>;
    control: Control<SourceArrayForm>;
    errors: FieldErrors<SourceArrayForm>;
}

/**
 * @author
 * @function PortfolioForm
 **/

export const PortfolioForm: FC<PortfolioFormProps> = ({ register, control, errors }) => {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "portfolios",
    });
    const portfolios = useWatch({ control, name: "portfolios" });

    console.log(portfolios);

    const [notionVerifyInfo, setNotionVerifyInfo] = useState<VerifyPageResponse[]>([]);

    const asyncNotionVerify = () =>
        pipe(
            notionVerify(),
            TE.map((notionVerify) => setNotionVerifyInfo(notionVerify)),
            TE.mapLeft((error) => setNotionVerifyInfo([]))
        )();

    useEffect(() => {
        asyncNotionVerify();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">포트폴리오</h2>
                <button
                    onClick={() =>
                        append({
                            id: Date.now().toString(),
                            type: "link",
                            subtype: "portfolio",
                            url: "",
                        })
                    }
                    className="text-primary transition-colors"
                >
                    <FiPlus className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3">
                        <div className="flex gap-2">
                            <Controller
                                control={control}
                                name={`portfolios.${index}.type`}
                                render={({ field: { value } }) => {
                                    return (
                                        <select
                                            value={value}
                                            onChange={(e) => {
                                                update(index, {
                                                    ...field,
                                                    type: e.target.value as "file" | "link",
                                                    url: "",
                                                });
                                            }}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                        >
                                            <option value="file">파일</option>
                                            <option value="link">링크</option>
                                            <option value="notion">노션 링크</option>
                                        </select>
                                    );
                                }}
                            />
                            <button
                                title="삭제"
                                type="button"
                                onClick={() => remove(index)}
                                className="text-red-500 ml-auto"
                            >
                                <FiTrash2 />
                            </button>
                        </div>

                        {portfolios[index]?.type === "file" && (
                            <Controller
                                control={control}
                                name={`portfolios.${index}.url`}
                                render={({ field: { onChange } }) => {
                                    return (
                                        <FileUploadForm
                                            onChange={(file) => {
                                                const { fileUrl } = file;
                                                onChange(fileUrl);
                                            }}
                                            accept=".pdf"
                                        />
                                    );
                                }}
                            />
                        )}

                        {portfolios[index]?.type === "link" && (
                            <div className="space-y-2 flex gap-2 items-center">
                                <input
                                    {...register(`portfolios.${index}.url`)}
                                    placeholder="URL을 입력하세요"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none  dark:bg-gray-700"
                                />
                            </div>
                        )}

                        {portfolios[index]?.type === "notion" && (
                            <div className="space-y-2 flex gap-2 items-center">
                                <select
                                    value={portfolios[index]?.url}
                                    {...register(`portfolios.${index}.url`)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none  dark:bg-gray-700"
                                >
                                    {notionVerifyInfo.map((info) => (
                                        <option key={info.id} value={info.url}>
                                            {info.title} 페이지
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {errors?.portfolios?.[index]?.url && (
                            <p className="text-red-500 text-sm">{errors.portfolios[index]?.url?.message}</p>
                        )}
                    </div>
                ))}

                {/* 배열 레벨 에러 메시지 */}
                {errors?.portfolios && !Array.isArray(errors.portfolios) && (
                    <p className="text-red-500">{errors.portfolios.message}</p>
                )}
            </div>
        </div>
    );
};
