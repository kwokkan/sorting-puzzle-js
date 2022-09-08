import { useLayoutEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { AppSetup } from "./AppSetup";
import { AppStatus } from "./AppStatus";
import { Game } from "./Game";
import { generateStyles, getInitialContainers, isGameWon, performMove } from "./game-utils";
import { CloseIcon, ResetIcon, SettingsIcon } from "./icons";
import { IContainer, ISettings } from "./types";

export const App = () => {
    const [settings, setSettings] = useState<ISettings>({
        itemsPerContainer: 4,
        containerCount: 4,
        emptyContainerCount: 2,
    });
    const [containers, setContainers] = useState<IContainer[]>([]);
    const [selectedContainerId, setSelectedContainerId] = useState<IContainer["id"] | null>(null);
    const [hasWon, setHasWon] = useState<boolean>(false);

    const [appStatus, setAppStatus] = useState<AppStatus>(AppStatus.Setup);

    const [headStyles, setHeadStyles] = useState<string>("");

    const handleOnSelect = (id: number) => {
        const newContainers = [...containers];
        const targetContainer = newContainers[id];

        if (id === selectedContainerId) {
            targetContainer.isSelected = !targetContainer.isSelected;
        }
        else {
            if (selectedContainerId !== null) {
                newContainers[selectedContainerId].isSelected = false;
            }

            targetContainer.isSelected = selectedContainerId === null;

            performMove(newContainers, selectedContainerId, id);
        }

        setHasWon(isGameWon(newContainers));
        setContainers(newContainers);
        setSelectedContainerId(targetContainer.isSelected ? id : null);
    };

    const handleOnSetupConfirm = (settings: ISettings) => {
        setSettings(settings);

        const containers = getInitialContainers(settings)
        setContainers(containers);
        setHeadStyles(generateStyles(containers));

        setAppStatus(AppStatus.Playing);
        setHasWon(false);
    };

    const restartGame = () => {
        setContainers(getInitialContainers(settings));
        setAppStatus(AppStatus.Playing);
        setHasWon(false);
    };

    const changeSettings = () => {
        setAppStatus(AppStatus.Setup);
    };

    const cancelSettings = () => {
        setAppStatus(AppStatus.Playing);
    };

    useLayoutEffect(() => {
        const element = document.getElementById("app-styles");

        if (!element) {
            return;
        }

        element.innerHTML = headStyles;
    }, [headStyles]);

    return (
        <div>
            <div className="header">
                <h1>
                    Sorting Puzzle
                </h1>

                <div>
                    {appStatus === AppStatus.Playing && (
                        <Fragment>
                            <button type="button" className="icon-button" onClick={restartGame}>
                                <ResetIcon />
                            </button>
                            <button type="button" className="icon-button" onClick={changeSettings}>
                                <SettingsIcon />
                            </button>
                        </Fragment>
                    )}

                    {appStatus === AppStatus.Setup && containers.length > 0 && (
                        <button type="button" className="icon-button" onClick={cancelSettings}>
                            <CloseIcon />
                        </button>
                    )}
                </div>
            </div>

            {appStatus === AppStatus.Setup && (
                <AppSetup settings={settings} onConfirm={handleOnSetupConfirm} />
            )}

            {appStatus === AppStatus.Playing && (
                <Fragment>
                    {hasWon && (
                        <h2 class="banner">
                            You won!
                        </h2>
                    )}

                    <Game containers={containers} onSelect={handleOnSelect}></Game>
                </Fragment>
            )}
        </div>
    );
};
