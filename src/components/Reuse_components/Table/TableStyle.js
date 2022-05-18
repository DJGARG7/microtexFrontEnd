import styled from "styled-components";

export const Styles = styled.div`
    .table--sticky {
        border: thin solid #031927;
        border-radius: 5px;

        .tr--sticky {
            :last-child {
                .td--sticky {
                    border-bottom: 0;
                }
            }
        }
        .th--sticky,
        .td--sticky {
            padding: 5px;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-bottom: thin solid #031927;
            border-right: thin solid #031927;
            background-color: #edf2f4;
            overflow: hidden;

            :last-child {
                border-right: 0;
            }
        }

        .th--sticky {
            // padding: 10px;
            // background-color: #04aa6d;
            background-color: #031927;

            border-right: 2px solid white;

            margin: 0;

            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: white;
        }

        &.sticky {
            overflow: auto;
            .header,
            .footer {
                position: sticky;
                z-index: 1;
            }

            .header--sticky {
                top: 0;
                // box-shadow: 0px 3px 3px #ccc;
            }

            .body--sticky {
                position: relative;
                z-index: 0;
            }

            [data-sticky-td--sticky] {
                position: sticky;
            }

            [data-sticky-last-left-td--sticky] {
                // box-shadow: 2px 0px 3px #ccc;
            }

            [data-sticky-first-right-td--sticky] {
                // box-shadow: -2px 0px 3px #ccc;
            }
        }
    }
`;
