import { CheckIcon } from '@radix-ui/react-icons';
import { useActionData } from '@remix-run/react';

export const Activated = () => {
  const actionData = useActionData();

  return (
    <div className="flex">
      {actionData?.step === 2 && (
        <div className="border-l-2 border-white  h-28 absolute -left-0.5 -bottom-3 z-10"></div>
      )}
      <li
        className={`ml-6 ${
          actionData?.step === 2
            ? 'p-5 border-2 border-green-100 rounded-md bg-green-50'
            : ''
        }`}
      >
        {actionData?.step === 2 ? (
          <>
            <div className="flex items-center">
              <span className="flex absolute bg-indigo-500 -left-4 justify-center items-center w-7 h-7 rounded-full">
                <CheckIcon className="w-4 h-4 text-white" />
              </span>
              <h2 className="text-lg ">Two-factor authentication activated</h2>
            </div>
            <p className="mb-5 mt-3 text-base">
              You have successfully added a second authentication factor for
              your account. You'll be prompted to use it the next time you log
              in
            </p>
          </>
        ) : (
          <div className="flex">
            <div className="border-l-2 border-white h-6 absolute -left-0.5 -bottom-3"></div>
            <div className="text-lg  flex items-center mb-3">
              <span className="flex absolute bg-indigo-500 -left-4 justify-center items-center w-7 h-7 rounded-full text-white  ">
                3
              </span>
              <h2>Two-factor authentication activated</h2>
            </div>
          </div>
        )}
      </li>
    </div>
  );
};
